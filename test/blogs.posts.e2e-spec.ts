import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import request from "supertest";
import { basicConstants } from "../src/features/auth/constants/basicConstants";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { appOptions } from "../src/core/options/app.options";

describe('Blogs/Posts-Controller (e2e)', ()=> {
  let app: INestApplication;
  let httpServer: any;
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    appOptions(app);

    await mongoose.connect(mongoUri);
    await app.init();
    httpServer = await app.getHttpServer();
    await request(httpServer).delete('/testing/all-data').expect(204);
  })
  afterAll(async () => {
    await mongoose.disconnect();
    await app.close();
  })

  //blog`s tests
  describe("******GET ALL BLOGS BEFORE TESTING", () => {
    it("1 - should return empty blogs array", async () => {
        const blogResponse = await request(httpServer).get('/blogs').expect(200)
        expect(blogResponse.body).toHaveProperty('pagesCount')
        expect(blogResponse.body.pagesCount).toBe(0)
        expect(blogResponse.body).toHaveProperty('page')
        expect(blogResponse.body.page).toBe(1)
        expect(blogResponse.body).toHaveProperty('pageSize')
        expect(blogResponse.body.pageSize).toBe(10)
        expect(blogResponse.body).toHaveProperty('totalCount')
        expect(blogResponse.body.totalCount).toBe(0)
        expect(blogResponse.body).toHaveProperty('items')
        expect(blogResponse.body.items).toBeInstanceOf(Array)
        expect(blogResponse.body.items.length).toBe(0)
    });
  })
  describe("CREATING TWO BLOGS", () => {
    it("2 - should create first blog", async () => {
      await request(httpServer).post('/blogs').expect(201)
        .set('Authorization', 'Basic '
          + btoa(`${basicConstants.username}:${basicConstants.password}`))
        .send({
          "name": "test Blog1",
          "description": "test blog description",
          "websiteUrl": "https://ask.chadgpt.ru/"
        })
    });
    it("3 - should create second blog", async () => {
      await request(httpServer).post('/blogs').expect(201)
        .set('Authorization', 'Basic '
          + btoa(`${basicConstants.username}:${basicConstants.password}`))
        .send({
          "name": "test Blog2",
          "description": "test blog description",
          "websiteUrl": "https://sadfdsfgsdghdsfsdf.ru"
        })
    });
    it("4 - should return two blogs", async () => {
      const response = await request(httpServer).get('/blogs').expect(200);
      expect(response.body).toHaveProperty('items');
      expect(response.body.items).toBeInstanceOf(Array);
      expect(response.body.items.length).toEqual(2)
      expect(response.body).toHaveProperty("totalCount");
      expect(response.body).toHaveProperty("page");
      expect(response.body.totalCount).toBe(2);
      expect(response.body.page).toBe(1);
    });
  })
  describe("CREATE BLOG WITH INCORRECT CREDENTIALS", () => {
    it("5 - should return 401 status", async () => {
      await request(httpServer).post('/blogs').expect(401);
    })
    it("6 - should return 401 status", async () => {
      await request(httpServer).post('/blogs').expect(401)
        .send({
          "name": "test Blog2",
          "description": "test blog description",
          "websiteUrl": "https://sadfdsfgsdghdsfsdf"
        })
    })
    it("7 - should return 401 status", async () => {
      await request(httpServer).post('/blogs').expect(401)
        .set('Authorization', 'Basic '
          + btoa(`incorrect password and login`))
        .send({
          "name": "test Blog2",
          "description": "test blog description",
          "websiteUrl": "https://sadfdsfgsdghdsfsdf.com"
        })
    })
    it("8 - should return 401 status", async () => {
      await request(httpServer).post('/blogs').expect(401)
        .set('Authorization', ''
          + btoa(`${basicConstants.username}:${basicConstants.password}`))
        .send({
          "name": "test Blog2",
          "description": "test blog description",
          "websiteUrl": "https://sadfdsfgsdghdsfsdf.com"
        })
    })
  })
  describe("CREATE BLOG WITH INCORRECT DATA", () => {
    it("9 - should return 400 status when blog name with length more than 15", async () => {
      //blog name with length more than 15
      const blog = await request(httpServer).post('/blogs')
        .set('Authorization', 'Basic '
          + btoa(`${basicConstants.username}:${basicConstants.password}`))
        .send({
          "name": "test blog name with length more than 15",
          "description": "test blog description",
          "websiteUrl": "https://sadfdsfgsdghdsfsdf.com"
        })
    expect(blog.status).toBe(400)
    })
    //blog name empty
    it("10 - should return 400 status without blog name", async () => {
      const response = await request(httpServer).post('/blogs')
        .set('Authorization', 'Basic '
          + btoa(`${basicConstants.username}:${basicConstants.password}`))
        .send({
          "name": "",
          "description": "test blog description",
          "websiteUrl": "https://sadfdsfgsdghdsfsdf.com"
        })
      expect(response.status).toBe(400);
    })
    //blog description empty
    it("11 - should return 400 status without blog description", async () => {
      await request(httpServer).post('/blogs')
        .set('Authorization', 'Basic '
          + btoa(`${basicConstants.username}:${basicConstants.password}`))
        .send({
          "name": "test Blog",
          "description": "",
          "websiteUrl": "https://sadfdsfgsdghdsfsdf.com"
        }).expect(400)
    })
    //blog websiteUrl empty
    it("12 - should return 400 status without blog websiteUrl", async () => {
      await request(httpServer).post('/blogs')
        .set('Authorization', 'Basic '
          + btoa(`${basicConstants.username}:${basicConstants.password}`))
        .send({
          "name": "test Blog",
          "description": "test blog description",
          "websiteUrl": ""
        }).expect(400)
    })
    //blog description with length more than 500
    it("13 - should return 400 status when blog description with length more than 500", async () => {
      const generateRandomString = (length: number) => {
        const characters = 'abcdefghijklmnopqrstuvwxyz';
        return Array.from({ length }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
      };
      const randomString = generateRandomString(501);

      await request(httpServer).post('/blogs').expect(400)
        .set('Authorization', 'Basic '
          + btoa(`${basicConstants.username}:${basicConstants.password}`))
        .send({
          "name": "test Blog",
          "description": `${randomString}`,
          "websiteUrl": "https://sadfdsfgsdghdsfsdf.com"
        })
    })
    //blog with incorrect websiteUrl
    it("14 - should return 400 status", async () => {
      await request(httpServer).post('/blogs').expect(400)
        .set('Authorization', 'Basic '
          + btoa(`${basicConstants.username}:${basicConstants.password}`))
        .send({
          "name": "test Blog",
          "description": "test blog description",
          "websiteUrl": "test_blog.com"
        });
    })
    //blog websiteUrl with length more than 100
    it("15 - should return 400 status when blog websiteUrl with length more than 100", async () => {
      const generateRandomString = (length: number) => {
        const characters = 'abcdefghijklmnopqrstuvwxyz';
        return Array.from({ length }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
      };
      const randomString = generateRandomString(101);
      await request(httpServer).post('/blogs').expect(400)
        .set('Authorization', 'Basic '
          + btoa(`${basicConstants.username}:${basicConstants.password}`))
        .send({
          "name": "test Blog",
          "description": "test blog description",
          "websiteUrl": `https://${randomString}`
        });
    })
  })
  describe("GET BLOG BY ID", () => {
    it("16 - should create blog and return it by id", async () => {
      const res = await request(httpServer).post("/blogs")
        .set('Authorization', 'Basic '
          + btoa(`${basicConstants.username}:${basicConstants.password}`))
        .send({
          "name": "test Blog1",
          "description": "test blog description",
          "websiteUrl": "https://sadfdsfgsdghdsfsdf.com"
        })
        .expect(201);
      const blogId = res.body.id;
      await request(httpServer).get(`/blogs/${blogId}`)
        .expect(200)
      expect(res.body).toHaveProperty("name")
      expect(res.body).toHaveProperty("description")
      expect(res.body).toHaveProperty("websiteUrl")
      expect(res.body).toHaveProperty("createdAt")
      expect(res.body).toHaveProperty("isMembership")
      expect(res.body.isMembership).toBe(false)
    });
  })
  describe("GET BLOG BY INCORRECT ID", () => {
    it("17 - should return 500 status", async () => {
      await request(httpServer).get(`/blogs/1`).expect(500);
    });
    it("18 - should return 404 status", async () => {
      await request(httpServer).get(`/blogs/60c72b2f9b1e8a3d88eae9e2`).expect(404);
    });
  })
  describe("CREATE, UPDATE AND GET BLOG BY ID", () => {
    it("19 - should create, update it and return blog by id", async () => {
      //creating blog for updating
      const res = await request(httpServer).post("/blogs")
        .set('Authorization', 'Basic '
          + btoa(`${basicConstants.username}:${basicConstants.password}`))
        .send({
          "name": "test update1",
          "description": "test blog description",
          "websiteUrl": "https://sadfdsfgsdghdsfsdf.ru"
        })
        .expect(201);

      //get created blog
      const blogId = res.body.id;
      await request(httpServer).get(`/blogs/${blogId}`)
        .expect(200)
      //updating blog`s name
      await request(httpServer).put(`/blogs/${blogId}`)
        .set('Authorization', 'Basic '
          + btoa(`${basicConstants.username}:${basicConstants.password}`))
        .send({
          "name": "test update2",
          "description": "test blog description",
          "websiteUrl": "https://sadfdsfgsdghdsfsdf.com"
        })
        .expect(204);
      //get updated blog
      const updateNameBlog = await request(httpServer).get(`/blogs/${blogId}`)
        .expect(200)
      expect(updateNameBlog.body).toHaveProperty("name")
      expect(updateNameBlog.body.name).toBe("test update2")

      //updating blog`s description
      await request(httpServer).put(`/blogs/${blogId}`)
        .set('Authorization', 'Basic '
          + btoa(`${basicConstants.username}:${basicConstants.password}`))
        .send({
          "name": "test update2",
          "description": "blog description update2",
          "websiteUrl": "https://sadfdsfgsdghdsfsdf.com"
        })
        .expect(204);
      //getting updated blog
      const updateDescriptionBlog = await request(httpServer).get(`/blogs/${blogId}`)
        .expect(200)
      expect(updateDescriptionBlog.body).toHaveProperty("description")
      expect(updateDescriptionBlog.body.description).toBe("blog description update2")


      //updating blog`s websiteUrl
      await request(httpServer).put(`/blogs/${blogId}`)
        .set('Authorization', 'Basic '
          + btoa(`${basicConstants.username}:${basicConstants.password}`))
        .send({
          "name": "test update2",
          "description": "test blog description update2",
          "websiteUrl": "https://websiteUrlUpdate2.com"
        })
        .expect(204);
      //get updated blog
      const updateWebsiteUrlBlog = await request(httpServer).get(`/blogs/${blogId}`)
        .expect(200)
      expect(updateWebsiteUrlBlog.body).toHaveProperty("websiteUrl")
      expect(updateWebsiteUrlBlog.body.websiteUrl).toBe("https://websiteUrlUpdate2.com")

    })
  })
  describe("CREATE, UPDATE AND GET BLOG BY ID WITH INCORRECT DATA", () => {
    it("20 - should create, update it and return blog and return it by id", async () => {
      //creating blog for updating
      const res = await request(httpServer).post("/blogs")
        .set('Authorization', 'Basic '
          + btoa(`${basicConstants.username}:${basicConstants.password}`))
        .send({
          "name": "blog update1",
          "description": "test blog description",
          "websiteUrl": "https://sadfdsfgsdghdsfsdf.ru"
        })
        .expect(201);

      //put blog with incorrect name
      const blogId = res.body.id;
      await request(httpServer).get(`/blogs/${blogId}`)
        .expect(200)
      //updating blog`s name
      await request(httpServer).put(`/blogs/${blogId}`)
        .set('Authorization', 'Basic '
          + btoa(`${basicConstants.username}:${basicConstants.password}`))
        .send({
          "name": 1,
          "description": "test blog description",
          "websiteUrl": "https://sadfdsfgsdghdsfsdf.com"
        })
        .expect(500);

      //put blog with incorrect description
      await request(httpServer).put(`/blogs/${blogId}`)
        .set('Authorization', 'Basic '
          + btoa(`${basicConstants.username}:${basicConstants.password}`))
        .send({
          "name": "blog update1",
          "description": 1,
          "websiteUrl": "https://sadfdsfgsdghdsfsdf.com"
        })
        .expect(500);
      //put blog with incorrect websiteUrl
      await request(httpServer).put(`/blogs/${blogId}`)
        .set('Authorization', 'Basic '
          + btoa(`${basicConstants.username}:${basicConstants.password}`))
        .send({
          "name": "blog update1",
          "description": "",
          "websiteUrl": 1
        })
        .expect(500);
      //put blog without name
      const responseWithoutName = await request(httpServer).put(`/blogs/${blogId}`)
        .set('Authorization', 'Basic '
          + btoa(`${basicConstants.username}:${basicConstants.password}`))
        .send({
          "description": "test blog description",
          "websiteUrl": "https://sadfdsfgsdghdsfsdf.com"
        })
        .expect(400)
        expect(responseWithoutName.body).toHaveProperty("errorsMessages")
        expect(responseWithoutName.body.errorsMessages[0]).toHaveProperty("message")
        expect(responseWithoutName.body.errorsMessages[0]).toHaveProperty("field")

      //put blog without description
      const responseWithoutDescription = await request(httpServer).put(`/blogs/${blogId}`)
        .set('Authorization', 'Basic '
          + btoa(`${basicConstants.username}:${basicConstants.password}`))
        .send({
          "name": "blog update1",
          "websiteUrl": "https://sadfdsfgsdghdsfsdf"
        })
        .expect(400)
      expect(responseWithoutDescription.body).toHaveProperty("errorsMessages")
      expect(responseWithoutDescription.body.errorsMessages[0]).toHaveProperty("message")
      expect(responseWithoutDescription.body.errorsMessages[0]).toHaveProperty("field")

      //put blog without description
      const responseWithoutWebsiteUrl = await request(httpServer).put(`/blogs/${blogId}`)
        .set('Authorization', 'Basic '
          + btoa(`${basicConstants.username}:${basicConstants.password}`))
        .send({
          "name": "blog update1",
          "description": "test blog description",
        })
        .expect(400)
      expect(responseWithoutWebsiteUrl.body).toHaveProperty("errorsMessages")
      expect(responseWithoutWebsiteUrl.body.errorsMessages[0]).toHaveProperty("message")
      expect(responseWithoutWebsiteUrl.body.errorsMessages[0]).toHaveProperty("field")
    })
  })
  describe("CREATE, UPDATE AND GET BLOG BY ID WITH INCORRECT CREDENTIALS", () => {
    it("21 - should create, update it and return blog and return it by id", async () => {
      //creating blog for updating
      const res = await request(httpServer).post("/blogs")
        .set('Authorization', 'Basic '
          + btoa(`${basicConstants.username}:${basicConstants.password}`))
        .send({
          "name": "blog update1",
          "description": "test blog description",
          "websiteUrl": "https://sadfdsfgsdghdsfsdf.com"
        })
        .expect(201);

      //put blog without incorrect credentials
      const blogId = res.body.id;
      await request(httpServer).get(`/blogs/${blogId}`)
        .expect(200)
      //updating blog`s name
      await request(httpServer).put(`/blogs/${blogId}`)
        .send({
          "name": 1,
          "description": "test blog description",
          "websiteUrl": "https://sadfdsfgsdghdsfsdf"
        })
        .expect(401);

      //put blog with incorrect credentials
      await request(httpServer).get(`/blogs/${blogId}`)
        .expect(200)
      await request(httpServer).put(`/blogs/${blogId}`)
        .set('Authorization', 'Basic '
          + btoa(`username:password`))
        .send({
          "name": "1",
          "description": "test blog description",
          "websiteUrl": "https://sadfdsfgsdghdsfsdf"
        })
        .expect(401);

      //put blog with incorrect password
      await request(httpServer).get(`/blogs/${blogId}`)
        .expect(200)
      await request(httpServer).put(`/blogs/${blogId}`)
        .set('Authorization', 'Basic '
          + btoa(`${basicConstants.username}:"password"`))
        .send({
          "name": 1,
          "description": "test blog description",
          "websiteUrl": "https://sadfdsfgsdghdsfsdf"
        })
        .expect(401);
      //put blog with incorrect username
      await request(httpServer).get(`/blogs/${blogId}`)
        .expect(200)
      await request(httpServer).put(`/blogs/${blogId}`)
        .set('Authorization', 'Basic '
          + btoa(`"username":${basicConstants.password}`))
        .send({
          "name": 1,
          "description": "test blog description",
          "websiteUrl": "https://sadfdsfgsdghdsfsdf"
        })
        .expect(401);
      })

    })
  describe("CREATE, UPDATE AND GET BLOG WITH INCORRECT ID", () => {
    it("22 - should create, update it and return blog and return it by id", async () => {
      await request(httpServer).get(`/blogs/1}`)
        .expect(500)
      await request(httpServer).put(`/blogs/{blogId}`)
        .send({
          "name": 1,
          "description": "test blog description",
          "websiteUrl": "https://sadfdsfgsdghdsfsdf"
        })
        .expect(401);
      await request(httpServer).put(`/blogs/blogId`)
        .send({
          "name": 1,
          "description": "test blog description",
          "websiteUrl": "https://sadfdsfgsdghdsfsdf.com"
        })
        .expect(401);
    })
  })

//post`s tests
  const fetchBlog = async (numberOfElement: number) => {
    const response = await request(httpServer).get("/blogs");
    return response.body.items[numberOfElement];
  };
  describe("******GET ALL POSTS BEFORE TESTING",() => {
    it("23 - should return empty posts array", async () => {
      const postsResponse = await request(httpServer).get('/posts').expect(200)
        expect(postsResponse.body).toHaveProperty('pagesCount')
        expect(postsResponse.body.pagesCount).toBe(0)
        expect(postsResponse.body).toHaveProperty('page')
        expect(postsResponse.body.page).toBe(1)
        expect(postsResponse.body).toHaveProperty('pageSize')
        expect(postsResponse.body.pageSize).toBe(10)
        expect(postsResponse.body).toHaveProperty('totalCount')
        expect(postsResponse.body.totalCount).toBe(0)
        expect(postsResponse.body).toHaveProperty('items')
        expect(postsResponse.body.items).toBeInstanceOf(Array)
        expect(postsResponse.body.items.length).toBe(0)
    });
  })
  describe("CREATING TWO POSTS", ()=>{
    it('should create two posts for 1 and 2 blogs',async ()=>{
      const blog1 = await fetchBlog(0);
      const blog2 = await fetchBlog(1);
      const post1 = await request(httpServer).post(`/posts`)
        .set('Authorization', 'Basic '
          + btoa(`${basicConstants.username}:${basicConstants.password}`))
        .send({
          "title": "test title 1",
          "shortDescription": "test shortDescription 1",
          "content": "test content 1",
          "blogId": `${blog1.id}`
        }).expect(201)
      const post2 = await request(httpServer).post(`/posts`)
        .set('Authorization', 'Basic '
          + btoa(`${basicConstants.username}:${basicConstants.password}`))
        .send({
          "title": "test title 2",
          "shortDescription": "test shortDescription 2",
          "content": "test content 2",
          "blogId": `${blog2.id}`
        }).expect(201)
    })
  })

  })