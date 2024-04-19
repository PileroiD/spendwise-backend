export const mapUser = (user) => ({
    id: user._id,
    email: user.email,
    registeredAt: user.createdAt,
});
