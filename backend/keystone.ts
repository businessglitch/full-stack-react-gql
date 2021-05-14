import { User } from './schemas/User';
import { Product } from './schemas/Product';
import { ProductImage } from './schemas/ProductImage';
import { CartItem } from './schemas/CartItem';
import { OrderItem } from './schemas/OrderItem';
import { Order } from './schemas/Order';
import { Role } from './schemas/Role';
import { permissionsList } from './schemas/fields';






import { createAuth } from '@keystone-next/auth';
import { withItemData, statelessSessions } from '@keystone-next/keystone/session';
import { config, createSchema } from '@keystone-next/keystone/schema';
import 'dotenv/config';
import { insertSeedData } from './seed-data';
import { sendPasswordResetEmail } from './lib/mail';
import { extendedGraphQLSchema } from './mutations';

const databaseURL = process.env.DATABASE_URL || 'mongodb://localhost/keystone-scik-fits-tutorial';

const sessionConfig = {
    maxAge: 60 * 60 * 24 * 360, // How long should they signed in
    secret: process.env.COOKIE_SECRET,
}

const { withAuth } = createAuth({
    listKey: 'User',
    identityField: 'email',
    secretField: 'password',
    initFirstItem: {
        fields: ['name', 'email', 'password'],
        // To DO: Add in initial roles here 
    },
    passwordResetLink: {
        async sendToken(args) {
            await sendPasswordResetEmail(args.token, args.identity)
        }
    }
})
export default withAuth(config({
    server: {
        cors: {
            origin: [process.env.FRONTEND_URL, process.env.FRONTEND_PROD_URL],
            credentials: true
        }
    },
    db: {
        adapter: 'mongoose',
        url: databaseURL,
        async onConnect(keystone) {
            console.log('Connected to the Database')
            if (process.argv.includes('--seed-data')) {
                await insertSeedData(keystone)
            }
        }
    },
    extendGraphqlSchema: extendedGraphQLSchema,
    lists: createSchema({
        // Schema items go in here
        User,
        Product,
        ProductImage,
        CartItem,
        OrderItem,
        Order,
        Role
    }),
    ui: {
        // // To do, change that for roles
        isAccessAllowed: ({ session }) => {
            return !!session?.data
        }
    },
    // Add Session values here
    session: withItemData(statelessSessions(sessionConfig), {
        User: `id email name role { ${permissionsList.join(' ')} }`
    })
}));