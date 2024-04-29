import request from "supertest";
import { app } from "../../server";
import { db, sequelize } from "../../database/models/index";
import{Response,Request} from "express"

beforeAll(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});

afterAll(async () => {
    try {
        await sequelize.close();
        console.log('Database connection closed successfully.');
    } catch (error) {
        console.error('Unable to close the database connection:', error);
    }
});

beforeEach(async () => {
    try {
        await sequelize.drop();
        console.log('All tables dropped successfully.');

        await sequelize.sync();
        console.log('All models were synchronized successfully.');
    } catch (error) {
        console.error('Unable to clear the database:', error);
    }
});
afterEach(async () => {
    try {
        await sequelize.drop();
        console.log('All tables dropped successfully.');

        await sequelize.sync();
        console.log('All models were synchronized successfully.');
    } catch (error) {
        console.error('Unable to clear the database:', error);
    }
});


describe('api/user/setUserRoles', () => {
    let token = '';

    beforeAll(async () => {
        const response = await request(app)
            .post('/api/user/registerUser')
            .send({
                firstName: "goreth18",
                lastName:"Mujawayezu",
                email: "mujawayezugorethe18@gmail.com",
                password: "123@Jacques",
                isAdmin: true,
                role: "admin"
            });
            console.log(response.body.message)

        const loginResponse = await request(app)
            .post('/api/user/loginUser')
            .send({
                email: response.body.data.email,
                password: "123@Jacques"
            });

        token = loginResponse.body.token;
        console.log(loginResponse.body.message);
    });

    describe("PUT /:id", () => {
        let newUser:any;

        beforeEach(async () => {
            newUser = await db.User.create({
                firstName: "Jacques",
                lastName: "Niyonkuru",
                role: "buyer",
                isAdmin: false,
                email: "niyonkurujacques@gmail.com",
                password: "123@Jacques"
            });
            console.log(newUser.userId)
        });

        it('should update the user role', async () => {
            const res = await request(app)
                .put('/api/user/setUserRole/' + newUser.userId)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    role: 'buyer'
                });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('message', 'user role updated');
        });
        it("should return 404 if the userId in not provided in the url-params",async()=>{
            const res = await request(app).post('/api/user/setUserRole').send({role:"seller"})
            expect(res.status).toBe(404);
        })
        it("should retun 400 if the  request body is not provided  ",async()=>{
            const res=await request(app).put('/api/user/setUserRole/'+newUser.userId)
             .set('Authorization', `Bearer ${token}`)
             .send({})
             expect(res.status).toBe(400);
             expect(res.body).toHaveProperty("status","fail")
        })
        it ('should return 401 if no token was provided',async()=>{

            const res= await request(app).put('/api/user/setUserRole/'+newUser.userId).
            send({
                role:"seller"
            })
            expect(res.status).toBe(401)
        })
        it('should return 500 if server error happens',async()=>{
            
            const res= await request(app).put('/api/user/setUserRole/'+newUser.userId).
            set('Authorization', `Bearer ${token}`)
            .send({
                role:[]
            })
            expect(res.status).toBe(500)
        })
    });
});
