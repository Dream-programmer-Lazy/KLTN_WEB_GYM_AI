const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    Name: { type: String, required: true },
    Age: { type: Number, required: true },
    Gender: { type: String, required: true },
    Membership_Type: { type: String, required: true },
    Avg_Workout_Duration_Min: { type: Number, required: true },
    Avg_Calories_Burned: { type: Number, required: true },
    Total_Weight_Lifted_kg: { type: Number, required: true },
    Visits_Per_Month: { type: Number, required: true },
    Favorite_Exercise: { type: String, required: true },
    churnProbability: { type: Number, default: 0 },
    churnRisk: { type: String, default: 'Chưa dự báo' }
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);