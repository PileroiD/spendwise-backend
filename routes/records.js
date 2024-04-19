import express from "express";
import { checkAuth } from "../middlewares/checkAuth.js";
import * as RecordController from "../controllers/record.js";
import { mapRecord } from "../utils/mapRecord.js";

const recordsRouter = express.Router({ mergeParams: true });

recordsRouter.post("/", checkAuth, async (req, res) => {
    try {
        const data = {
            user_id: req.user.id,
            account_id: req.body.account_id,
            account_name: req.body.account_name,
            title: req.body.title,
            type: req.body.type,
            amount: req.body.amount,
            description: req.body.description,
            image_url: req.body.image_url
                ? req.body.image_url
                : "https://static-00.iconduck.com/assets.00/money-icon-512x512-yap724b9.png",
        };

        const record = await RecordController.addRecord(data);

        res.send({
            error: null,
            record: mapRecord(record),
        });
    } catch (error) {
        console.log("error :>> ", error);
        res.send({
            error: error.message,
            record: null,
        });
    }
});

recordsRouter.get("/", checkAuth, async (req, res) => {
    try {
        const { records, lastPage } = await RecordController.getRecords(
            req.user.id,
            req.query.type,
            req.query.search,
            req.query.limit,
            req.query.page
        );

        res.send({
            error: null,
            records: records.map(mapRecord),
            lastPage,
        });
    } catch (error) {
        console.log("error :>> ", error);
        res.send({
            error: error.message,
            records: null,
        });
    }
});

recordsRouter.get("/:id", checkAuth, async (req, res) => {
    try {
        const record = await RecordController.getOne(req.params.id);

        res.send({
            error: null,
            record: mapRecord(record),
        });
    } catch (error) {
        console.log("error :>> ", error);
        res.send({
            error: error.message,
            records: null,
        });
    }
});

recordsRouter.patch("/:id", checkAuth, async (req, res) => {
    try {
        const data = {
            user_id: req.user.id,
            account_name: req.body.account_name,
            account_id: req.body.account_id,
            title: req.body.title,
            type: req.body.type,
            amount: req.body.amount,
            description: req.body.description,
            image_url: req.body.image_url
                ? req.body.image_url
                : "https://static-00.iconduck.com/assets.00/money-icon-512x512-yap724b9.png",
        };

        const record = await RecordController.editOne(req.params.id, data);

        res.send({
            error: null,
            record: mapRecord(record),
        });
    } catch (error) {
        console.log("error :>> ", error);
        res.send({
            error: error.message,
            records: null,
        });
    }
});

recordsRouter.delete("/:id", checkAuth, async (req, res) => {
    try {
        await RecordController.deleteOne(req.params.id);

        res.send({
            error: null,
            success: true,
        });
    } catch (error) {
        console.log("error :>> ", error);
        res.send({
            error: error.message || "Unknown error",
            record: null,
        });
    }
});

export default recordsRouter;
