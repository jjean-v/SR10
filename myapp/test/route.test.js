const request = require("supertest");
const app = require("../app");


describe("Test the organisation path", () => {
    test("It should response the GET method", done => {
        request(app)
            .get("/organisations")
            .then(response => {
                expect(response.statusCode).toBe(200);
                done();
            });
    });
});

describe("Test the candidature path", () => {
    test("It should response the GET method", done => {
        request(app)
            .get("/candidatures")
            .then(response => {
                expect(response.statusCode).toBe(200);
                done();
            });
    });
});

describe("Test the fiche_de_poste path", () => {
    test("It should response the GET method", done => {
        request(app)
            .get("/fiche_de_poste")
            .then(response => {
                expect(response.statusCode).toBe(200);
                done();
            });
    });
});

describe("Test the login path", () => {
    test("It should response the GET method", done => {
        request(app)
            .get("/")
            .then(response => {
                expect(response.statusCode).toBe(200);
                done();
            });
    });
});

describe("Test the new_user path", () => {
    test("It should response the GET method", done => {
        request(app)
            .get("/new_user")
            .then(response => {
                expect(response.statusCode).toBe(200);
                done();
            });
    });
});



describe("Test the offre path", () => {
    test("It should response the GET method", done => {
        request(app)
            .get("/offre")
            .then(response => {
                expect(response.statusCode).toBe(200);
                done();
            });
    });
});

describe("Test the piece path", () => {
    test("It should response the GET method", done => {
        request(app)
            .get("/pieces")
            .then(response => {
                expect(response.statusCode).toBe(200);
                done();
            });
    });
});

describe("Test the utilisateurs path", () => {
    test("It should response the GET method", done => {
        request(app)
            .get("/utilisateurs")
            .then(response => {
                expect(response.statusCode).toBe(200);
                done();
            });
    });
});

describe("Test the recruteur path", () => {
    test("It should response the GET method", done => {
        request(app)
            .get("/utilisateurs/recruteur")
            .then(response => {
                expect(response.statusCode).toBe(200);
                done();
            });
    });
});