const asyncHandler = (requestHandler) = (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((error) => next(error));
}
// 👆🏻 similar works middlewares then  next then middleware like .. simple common function
// const asyncHandler = (fn) => async () => {
//     try {
//         await fn(req, res, next);
//     } catch (err) {
//         res.status(err.code || 500).json({ success: false, message: err.message });
//     }
// }

export { asyncHandler };