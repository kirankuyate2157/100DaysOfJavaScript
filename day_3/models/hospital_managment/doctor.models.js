import mongoose from "mongoose"

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    qualification: { type: String, required: true },
    salary: { type: String, required: true },
    experienceInYear: { type: Number, required: true, default: 0 },
    workInHospital: [{ type: mongoose.Schema.Types.ObjectId, ref: "Hospital" }],
    phone: { type: Number, required: true },


}, { timestamps: true });

export const Doctor = mongoose.model('Doctor', doctorSchema);