import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import request from "supertest";
import { basicConstants } from "../src/features/auth/constants/basicConstants";

describe('Post-Controller (e2e)', ()=>{
  let app: INestApplication;
  let httpServer: any;

  beforeAll(async() => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports:[AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await  app.init();
    httpServer = await app.getHttpServer();
    await request(httpServer).delete('/testing/all-data').expect(204);
  })
  afterAll(async () => {
    await app.close();
  })
  it("(/ GET) Should return all posts", async () => {
    const response = await request(httpServer).get('/posts').expect(200);
      expect(response.body).toHaveProperty('items');
      expect(response.body.items).toBeInstanceOf(Array);
      expect(response.body.items.length).toEqual(0)
  });

  it("(/ POST) (e2e)", async () => {
     await request(httpServer).post('/blogs').expect(201)
      .set('Authorization', 'Basic '
      + btoa(`${basicConstants.username}:${basicConstants.password}`))
      .send({
        "name": "test Blog",
        "description": "test blog description",
        "websiteUrl": "https://sadfdsfgsdghdsfsdf" })


    const blog = await request(httpServer).get('/blogs').expect(200)
    const blogId = blog.body.items[0].id;


    const response = await request(httpServer).post(`/posts`)
      .send({"title": "test title",
                  "shortDescription": "test short description",
                  "content": "test content",
                  "blogId": `${blogId}`})
      .set('Authorization', 'Basic '
        + btoa(`${basicConstants.username}:${basicConstants.password}`))
      .expect(201)
        expect(response.body).toHaveProperty('blogName');
        expect(response.body).toHaveProperty('content');
        expect(response.body).toHaveProperty('extendedLikesInfo');
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('title');
        expect(response.body).toHaveProperty('shortDescription');
        expect(response.body).toHaveProperty('blogId');
  })
  it("(/ GET) (e2e)should return creating post", async () => {
    const posts = await request(httpServer).get('/posts').expect(200)
    expect(posts.body.items.length).toBeGreaterThan(0);
    const post = posts.body.items[0];
    await request(httpServer).get(`/posts/${post.id}`).expect(200)
  });
  it("(/ GET) (e2e)should all posts", async () => {
    const posts = await request(httpServer).get('/posts').expect(200)
    expect(posts.body.items.length).toBeGreaterThan(0);
    expect(posts.body).toHaveProperty('pagesCount')
    expect(posts.body).toHaveProperty('page')
    expect(posts.body).toHaveProperty('pageSize')
    expect(posts.body).toHaveProperty('totalCount')
    expect(posts.body).toHaveProperty('items')
  });
})