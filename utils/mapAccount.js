import { mapRecord } from "./mapRecord.js";
import { mapUser } from "./mapUser.js";

export const mapAccount = (account, isAllData) => {
    return {
        id: account._id,
        title: account.title,
        amount: account.amount,
        initialAmount: account.initialAmount,
        imageUrl: account.image_url,
        createdAt: account.createdAt,
        user: isAllData === "true" ? mapUser(account.user) : undefined,
        records:
            isAllData === "true" ? account?.records?.map(mapRecord) : undefined,
    };
};
