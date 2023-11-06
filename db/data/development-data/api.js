const axios = require('axios');
const fs = require('fs');
const path = require('path');

const allSwimSpotsAPI = axios.create({ baseURL: 'https://environment.data.gov.uk/doc/bathing-water?_pageSize=500' });

const getCoastalSpots = async () => {
    const res = await allSwimSpotsAPI.get();
    const allSwimSpots = res.data.result.items;
    const formattedData = [];
    for (const item of allSwimSpots) {
        const bodyAndImgAPI = await allSwimSpotsAPI.get(item.latestProfile);
        const bodyAndImgData = bodyAndImgAPI.data.result.primaryTopic;
        const waterTestDateAPI = await allSwimSpotsAPI.get(item.latestSampleAssessment);
        const waterTestDate = waterTestDateAPI.data.result.primaryTopic.sampleDateTime.inXSDDateTime._value

        const formattedItem = {
            coordinates: [item.samplingPoint.long, item.samplingPoint.lat],
            created_at: null,
            location_name: item.name._value,
            location_area: item.district[0].name._value,
            water_classification: item.latestComplianceAssessment
                ? item.latestComplianceAssessment.complianceClassification.name._value
                : null,
            water_classification_date: waterTestDate,
            location_img_url: bodyAndImgData.webResImage || null,
            body: bodyAndImgData.bathingWaterDescription._value || null
        };
        formattedData.push(formattedItem);
        const jsonData = JSON.stringify(formattedData, null, 2);
        const filePath = path.join(process.cwd(), 'db/data/development-data/swim_api_locations.js');

        fs.writeFileSync(filePath, jsonData);
    }
    return formattedData
}

getCoastalSpots();
    