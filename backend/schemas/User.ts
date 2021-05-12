import { list } from "@keystone-next/keystone/schema";
import { text, password, relationship } from '@keystone-next/fields';
import { permissions, rules } from "../access";

export const User = list({
    access: {
        create: () => true,
        update: rules.canManageUsers,
        delete: permissions.canManageUsers,
        read: rules.canManageUsers
    },
    ui: {
        // Hide backend UI from regular users
        hideCreate: (args) => !permissions.canManageUsers(args),
        hideDelete: (args) => !permissions.canManageUsers(args)
    },
    fields: {
        name: text({ isRequired: true }),
        email: text({ isRequired: true, isUnique: true }),
        password: password(),
        role: relationship({
            ref: 'Role.assignedTo',
            access: {
                create: permissions.canManageUsers,
                update: permissions.canManageUsers
            },
        }),
        cart: relationship({
            ref: 'CartItem.user',
            many: true,
            ui: {
                createView: { fieldMode: 'hidden' },
                itemView: { fieldMode: 'read' }
            }
        }),
        orders: relationship({ ref: 'Order.user', many: true }),
        products: relationship({
            ref: 'Product.user',
            many: true,
        }),
    },

})
