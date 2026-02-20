# Submission Summary

## Track Chosen
<!-- Mark your choice with [x] -->
- [X] Backend Only
- [ ] Frontend Only
- [ ] Full-Stack (Both)

## GitHub Copilot Usage Summary
<!-- Describe how you used AI throughout the test. Be specific about when and how you leveraged AI tools. -->

 - I used the Github copilot AI to generate the task management system by giving prompt based on the requirement.
 - By giving the clear requirement and prompt It create the complete system properly.

## Key Prompts Used

1. Here is the boilerplat repo of the expressJs project in the backend folder.
First review the existing backend folder structure.
In this backend need to implement the Task management system using the REST API.

It should have task create, list, edit, delete features.

Note:

use in memory database as this is for the POC purpose.
add proper error handling in the operations and the API calls.
You can choose proper fields for the task but it should have the field for the status management
Also add input validations as well using joi.
I also attached the backend/README.md -- you can utilize that the further context (But do not modify that)
As it's for the POC purpose, skip extra feature or file from the creation and skip

2. Now, we need to keep this fuuntionality as it is. But with this upgrade the implementation as per below check list:

proper error handling and logging (use console log for the POC)
it should be production safe implementation.

3. Now we have the modify in the logging requirement, as we used console log initially but now let's replace it by the Winston logger.
Log should print > req method, URL, execution time,
Log format: [METHOD] /endpoint - Execution time: Xms.

4. Based on the task routes and task validator, create API_ROUTES.md file, in which add all the API endpoint with it's request and response details.
Note: this will be utilize for the front end reference for the API integration.

5. Now let's add new requirement as below:

Add priority field in task (High,low, mid) and due date as well.
If the priority is high, set the due date automatically next 7th date.
Also add sort by due date feature.

Note: It should capture all the incomming requests.

6. Let's add one more, validation for the task modification.
If any task marked as completed, then further it should not be modified.


## Design Decisions (optional)
<!-- Explain key architectural or implementation decisions you made and why -->

- **Decision 1:** Implemented layered architecture (Routes → Controllers → Services)
  - **Reasoning:** Separation of concerns makes the code maintainable and testable. Routes handle HTTP specifics, controllers orchestrate business logic, and services manage data. This structure makes it easy to replace in-memory storage with a database later.

- **Decision 2:** Custom error class hierarchy with proper HTTP status codes
  - **Reasoning:** Provides consistent error handling across the application (NotFoundError-404, ForbiddenError-403, ValidationError-400). Makes error responses predictable and easier to handle on the frontend.

- **Decision 3:** Winston logger with structured logging format
  - **Reasoning:** Production-grade logging with timestamps, log levels, and request tracking. Format: `[METHOD] /endpoint - Execution time: Xms` provides clear visibility into API performance and helps with debugging and monitoring.

- **Decision 4:** Business rule enforcement (automatic due dates and immutable completed tasks)
  - **Reasoning:** HIGH priority tasks automatically get 7-day deadlines to prevent oversight. Completed tasks become immutable (403 Forbidden) to preserve audit trail and maintain data integrity. 

## Challenges Faced
<!-- Optional: Describe any challenges encountered and how you overcame them -->

[Write your response here]

## Time Breakdown
<!-- Optional: Approximate time spent on each phase -->

- Planning & Setup: [X minutes]
- Core Implementation: [X minutes]
- Testing & Debugging: [X minutes]
- Additional Requirements (30-min mark): [X minutes]
- Additional Requirements (45-min mark): [X minutes]
- Optional Challenge (if attempted): [X minutes]

## Optional Challenge
<!-- If you attempted an optional challenge, specify which one -->

- [ ] Not Attempted
- [ ] Option 1: Request Logging Middleware
- [ ] Option 2: API Pagination
- [ ] Option 3: Advanced Validation
- [ ] Option 4: Task Filtering & Search
- [ ] Option 5: Form Validation & UX
- [ ] Option 6: Drag-and-Drop Task Reordering
- [ ] Option 7: Local Storage / Offline Support
- [ ] Option 8: Real-time Updates
- [ ] Option 9: Task Statistics Dashboard

## Additional Notes
<!-- Any other information you'd like to share about your implementation -->

[Write your response here]

---

## Submission Checklist
<!-- Verify before submitting -->

- [ ] Code pushed to public GitHub repository
- [ ] All mandatory requirements completed
- [ ] Code is tested and functional
- [ ] README updated (if needed)
- [ ] This SUBMISSION.md file completed
- [ ] MS Teams recording completed and shared
- [ ] GitHub repository URL provided to RM
- [ ] MS Teams recording link provided to RM
