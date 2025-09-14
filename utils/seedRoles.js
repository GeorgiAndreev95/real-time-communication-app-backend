import Role from "../src/models/Role.js";

const seedRoles = async () => {
    const roles = ["owner", "admin", "member"];

    for (const role of roles) {
        await Role.findOrCreate({
            where: { name: role }, // check if role exists
            defaults: { name: role }, // create it if it doesn’t
        });
    }

    console.log("✅ Roles seeded successfully");
};

export default seedRoles;
