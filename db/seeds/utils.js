exports.convertReviewDateToISOString = ({created_at, ...otherProperties}) => {
    if (!created_at) return { ...otherProperties };
    return { created_at: new Date(created_at), ...otherProperties };
}
exports.convertLocationDateToISOString = ({water_classification_date, ...otherProperties}) => {
    if (!water_classification_date) return { ...otherProperties };
    return { water_classification_date: new Date(water_classification_date), ...otherProperties };
}
