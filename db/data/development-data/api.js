const axios = require('axios');
const fs = require('fs');
const path = require('path');

const waterAPI = axios.create({ baseURL: 'https://environment.data.gov.uk/doc/bathing-water?_pageSize=500' });

const getCoastalSpots = () => {
    return waterAPI.get()
        .then((res) => {
            const allData = res.data.result.items;

            const formattedData = allData.map(item => ({
                coordinates: [item.samplingPoint.long, item.samplingPoint.lat],
                location_name: item.name._value,
                location_area: item.district[0].name._value,
                water_classification: item.latestComplianceAssessment
                    ? item.latestComplianceAssessment.complianceClassification.name._value
                    : null,
                created_at: null,
                water_classification_date_api: item.latestSampleAssessment,
                img_and_body_api: item.latestProfile,
            }));

            const jsonData = JSON.stringify(formattedData, null, 2);
            const filePath = path.join(process.cwd(), 'db/data/development-data/swim_api_locations.js');

            fs.writeFileSync(filePath, jsonData);
        })
        .catch((err) => {
            console.error(err);
        });
};

getCoastalSpots();
