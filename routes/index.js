import express from "express";

import authRouter from "./auth.js";
import accountRouter from "./account.js";
import recordsRouter from "./records.js";

const router = express.Router({ mergeParams: true });

router.use("/", authRouter);
router.use("/accounts", accountRouter);
router.use("/records", recordsRouter);

export default router;
