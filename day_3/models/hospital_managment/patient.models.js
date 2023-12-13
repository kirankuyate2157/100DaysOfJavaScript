import mongoose from " mongoose "

const patientSchema = new mongoose.Schema({

    name: { type: String, required: true, lowercase: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true, enum: ["M", "F", "O"] },
    bloodGroup: { type: String, required: true },
    diagnosedWith: { type: String, required: true },
    address: { type: String, required: true },
    hospitalIn: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital", required: true },
    records: { type: String, required: true },



}, { timestamps: true });


export const Patient = mongoose.model('Patient', patientSchema);