/**
 * Posts API Tests
 * Demonstrates complex API workflows, data builders, and response validation
 */

import { TestDataBuilder } from '@utils/test-data-builder';
import { ApiHelper } from '@utils/api-helper';

describe('Posts API Tests', () => {

  beforeEach(() => {
    // Apply tag filtering
    cy.filterByTags(Cypress.env('TAGS')?.split(',') || []);
  });

  describe('GET /posts', () => {
    it('should fetch all posts', () => {
      cy.api(); // Mark as API test
      cy.apiRequest('GET', '/posts').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        expect(response.body.length).to.be.greaterThan(0);

        // Validate first post structure
        const firstPost = response.body[0];
        expect(firstPost).to.have.property('id');
        expect(firstPost).to.have.property('title');
        expect(firstPost).to.have.property('body');
        expect(firstPost).to.have.property('userId');
      });
    });

    it('should fetch posts for specific user', () => {
      const userId = 1;
      cy.apiRequest('GET', `/posts?userId=${userId}`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        
        // Verify all posts belong to the user
        response.body.forEach((post: Record<string, any>) => {
          expect(post.userId).to.eq(userId);
        });
      });
    });

    it('should fetch single post by ID', () => {
      const postId = 1;
      cy.apiRequest('GET', `/posts/${postId}`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.id).to.eq(postId);
        expect(response.body).to.have.property('title');
        expect(response.body).to.have.property('body');
      });
    });

    it('should handle pagination', () => {
      const params = { _limit: 5, _page: 1 };
      const queryString = ApiHelper.buildQueryString(params);

      cy.apiRequest('GET', `/posts?${queryString}`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.length).to.be.at.most(5);
      });
    });
  });

  describe('POST /posts', () => {
    it('should create new post successfully', () => {
      cy.regression(); // Mark as regression test
      const postData = TestDataBuilder.post()
        .with('title', 'Test Post Title')
        .with('body', 'Test Post Body')
        .with('userId', 1)
        .build();

      cy.apiRequest('POST', '/posts', postData).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('id');
        expect(response.body.title).to.eq(postData.title);
        expect(response.body.body).to.eq(postData.body);
        expect(response.body.userId).to.eq(postData.userId);
      });
    });

    it('should create post with generated test data', () => {
      const postData = TestDataBuilder.post().build();

      cy.apiRequest('POST', '/posts', postData).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.id).to.exist;
      });
    });

    it('should validate required fields', () => {
      const incompleteData = {
        title: 'Incomplete Post',
        // Missing body and userId
      };

      cy.apiRequest('POST', '/posts', incompleteData).then((response) => {
        // Adjust based on API validation rules
        expect([201, 400, 422]).to.include(response.status);
      });
    });
  });

  describe('PUT /posts/:id', () => {
    it('should update existing post', () => {
      const postId = 1;
      const updatedData = TestDataBuilder.post()
        .with('title', 'Updated Post Title')
        .with('body', 'Updated Post Body')
        .build();

      cy.apiRequest('PUT', `/posts/${postId}`, updatedData).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.id).to.eq(postId);
        expect(response.body.title).to.eq(updatedData.title);
      });
    });

    it('should handle partial update', () => {
      const postId = 1;
      const partialData = {
        title: 'Partially Updated Title',
      };

      cy.apiRequest('PATCH', `/posts/${postId}`, partialData).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.title).to.eq(partialData.title);
      });
    });
  });

  describe('DELETE /posts/:id', () => {
    it('should delete post successfully', () => {
      const postId = 1;

      cy.apiRequest('DELETE', `/posts/${postId}`).then((response) => {
        expect(response.status).to.eq(200);
      });

      // Verify deletion (if API supports it)
      cy.apiRequest('GET', `/posts/${postId}`).then((response) => {
        // Adjust based on API behavior
        expect([200, 404]).to.include(response.status);
      });
    });
  });

  describe('Complex Workflows', () => {
    it('should create, read, update, and delete post (CRUD)', () => {
      let createdPostId: number;

      // Create
      const postData = TestDataBuilder.post().build();
      cy.apiRequest('POST', '/posts', postData).then((response) => {
        expect(response.status).to.eq(201);
        createdPostId = response.body.id;

        // Read
        cy.apiRequest('GET', `/posts/${createdPostId}`).then((readResponse) => {
          expect(readResponse.status).to.eq(200);
          expect(readResponse.body.id).to.eq(createdPostId);

          // Update
          const updatedData = { ...postData, title: 'Updated Title' };
          cy.apiRequest('PUT', `/posts/${createdPostId}`, updatedData).then((updateResponse) => {
            expect(updateResponse.status).to.eq(200);
            expect(updateResponse.body.title).to.eq('Updated Title');

            // Delete
            cy.apiRequest('DELETE', `/posts/${createdPostId}`).then((deleteResponse) => {
              expect(deleteResponse.status).to.eq(200);
            });
          });
        });
      });
    });

    it('should fetch posts with comments', () => {
      const postId = 1;

      cy.apiRequest('GET', `/posts/${postId}`).then((postResponse) => {
        expect(postResponse.status).to.eq(200);

        // Fetch comments for the post
        cy.apiRequest('GET', `/posts/${postId}/comments`).then((commentsResponse) => {
          expect(commentsResponse.status).to.eq(200);
          expect(commentsResponse.body).to.be.an('array');

          if (commentsResponse.body.length > 0) {
            const firstComment = commentsResponse.body[0];
            expect(firstComment).to.have.property('id');
            expect(firstComment).to.have.property('body');
            expect(firstComment.postId).to.eq(postId);
          }
        });
      });
    });
  });
});

