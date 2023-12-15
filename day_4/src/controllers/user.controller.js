import { asyncHandler } from "../utils/asyncHandler.js";

const registration = asyncHandler(async (req, res) => {
    res.status(200).json({
        message: "ok 👍🏻"
    })
})

export { registration };