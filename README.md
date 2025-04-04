# RDE

### Description

For our final project, we were given one week to create an app that would showcase our skills. I wanted to build something practical that I could reference for future projects, particularly websites for real-world clients. I decided to create a Talent Agency App for a family member. The app allows users to log in, browse illustrator profiles, and submit proposals to the admin. On the backend, the app includes an Admin Panel where administrators can manage,  review and update the status of proposals. 

### Deployment

https://brilliant-dasik-97a8a6.netlify.app/

Please sign up and log in to explore the app!

### Technologies used

HTML, CSS, JavaScript, React, Node.js, Python, Django, Material UI, Netlify, Heroku

### Brief

- Build a full-stack application by making your own backend and your own front-end.
- Use a Python Django API using Django REST Framework to serve your data from a Postgres database.
- Consume your API with a separate front-end built with React.
- Be a complete product which most likely means multiple relationships and CRUD functionality for at least a couple of models.
- Implement thoughtful user stories/wireframes that are significant enough to help you know which features are core MVP and which you can cut.
- Have a visually impressive design to kick your portfolio up a notch and have something to wow future clients & employers. 
- Be deployed online so it's publicly accessible.

### Planning

I started by creating wireframes, which I ended up following quite closely throughout the project. I had a clear vision for the design, aiming for a minimalistic and clean layout that would allow the focus to remain on the illustrators and their work. In addition to the wireframes, I also created an ERD diagram, a routing table, and a Trello board to help organise the project and plan out the structure and workflow efficiently.

![RDE](<ReadMe Images/rde-wireframes.png>)

![RDE](<ReadMe Images/rde-erd.png>)

![RDE](<ReadMe Images/rde-routing-table.png>)

### Build/Code process

Being the last project of the course, I felt more equipped to get stuck into this project on my own. My planning felt sufficient, and I knew what my process would be. Despite being our first project using Python and Django, I slipped into it fairly easily, giving me faith in my ability to pick up other languages further down the line!

I found my notes really useful in this setup process, and it felt incredibly satisfying being able to see and feel my growth as I smoothly progressed through it.

### Backend Code Snippets

``` javascript
class JWTAuthentication(BaseAuthentication):
    def authenticate(self, request):

        if not request.headers:
            return None

        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return None
        
        if not auth_header.startswith('Bearer'):
            raise AuthenticationFailed('Auth header not a valid bearer token')
        
        token = auth_header.replace('Bearer ', '')
        
        try:
            payload = jwt.decode(
                jwt=token, 
                key=settings.SECRET_KEY,
                algorithms=['HS256']
            )

            user = User.objects.get(id=payload['user']['id'])

            return (user, token)
        except Exception as e:
            print(e)

            raise AuthenticationFailed('Invalid credentials provided')
```

I implemented custom JWT-based authentication to secure API endpoints. The authentication class verifies the token sent in the request headers, decodes it using a secret key, and checks if the user exists in the database. If any step fails, it raises an authentication error, which I found helpful when debugging issues with tokens. This process allowed me to understand the flow of authentication better, especially while inspecting the tokens and using developer tools

``` javascript
from rest_framework import serializers
from django.contrib.auth import get_user_model, password_validation, hashers

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password_confirmation = serializers.CharField(write_only=True)

    def validate(self, data):
        password = data.pop('password')
        password_confirmation = data.pop('password_confirmation')

        if password != password_confirmation:
            raise serializers.ValidationError({'password_confirmation': 'Passwords do not match.'})

        password_validation.validate_password(password)

        data['password'] = hashers.make_password(password)

        return data

    class Meta:
        model = get_user_model()
        fields = ('id', 'username', 'email', 'is_staff', 'password', 'password_confirmation')

```

Above is my UserSerializer, it's responsible for handling user data during registration. It ensures that passwords match, validates password strength, and hashes the password before saving it to the database. This serializer is a key part of the user registration process in the RegisterView, where new users are validated and created securely.

``` javascript
class RegisterView(APIView):
    def post(self, request):
        serialized_user = UserSerializer(data=request.data)
        if serialized_user.is_valid():
            serialized_user.save()
            print(serialized_user.data)
            return Response(serialized_user.data, 201)
        return Response(serialized_user.errors, 422)
```
The registration process is handled by the RegisterView class shown above, where user data is validated using the UserSerializer. If the data is valid, a new user is created and the response is returned with the user's data. If not, validation errors are returned to inform the user about the incorrect input.

### Frontend Code Snippets

In this project, I implemented role-based UI rendering and data fetching based on whether the user is an admin or a regular user. To achieve this, I used two key sections of code, both of which exist within my ProposalIndex.jsx file. This file contains the logic to display the appropriate proposals based on the current user's role.

``` javascript
 useEffect(() => {
    const fetchProposals = async () => {
      setIsLoading(true);
      try {
        let data;
        if (user.is_admin) {
          data = await adminProposalIndex();
        } else {
          data = await userProposalIndex();
        }
        setProposal(data);
      } catch (error) {
        console.error("Error fetching proposals:", error);
      } finally {
        setIsLoading(false);
      }
    };
```
This section of the code fetches data based on the user’s role. Admins are allowed to view all proposals, while regular users only see their own. This ensures that data access is correctly filtered based on the user’s role.

``` javascript
{user.is_admin
  ? proposal.map((prop) => (
      <div key={prop.id}>
        {/* Admin specific view */}
        <div className={styles.statusUpdate}>
          <label>Update status: </label>
          <select
            value={prop.status}
            onChange={(e) =>
              handleStatusChange(prop.id, e.target.value)
            }
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <button onClick={() => handleRemove(prop.id)}>Delete Proposal</button>
      </div>
    ))
  : proposal.map((prop) => (
      <div key={prop.id}>
        {/* Regular user specific view */}
        <button onClick={() => handleUpdate(prop.id)}>Update Proposal</button>
      </div>
    ))}
```

This code is responsible for conditionally rendering the UI. Admin users are able to access additional features, such as updating the status of proposals and deleting any, they can also view proposals submitted by all users. Regular users can only view their own proposals. This approach ensures that each user is shown the appropriate functionalities according to their role.

IMAGES HERE

### Challenges
- Naming Conventions and Code Organization: When using previous projects for reference, I encountered issues related to naming conventions, which caused confusion in how data was accessed or displayed. This taught me the importance of taking time to carefully organize and name variables, functions, and files in a meaningful way.
- Debugging Authentication: One of the major challenges was debugging the authentication process. Dealing with JWTs, inspecting tokens, and understanding the flow of authentication required close attention to detail. I often had to refer to my terminal for error messages and use developer tools to understand token validation and handling better.

### Wins
- Custom JWT Authentication: Successfully implementing JWT-based authentication was a key win. It was satisfying to see the flow of user login, token generation, and the ability to authenticate API calls using these tokens. Debugging this process and getting it to work as expected was a major accomplishment.
- Role-Based UI Rendering: The role-based UI rendering system for admins and regular users was another major win. It allowed for a flexible and secure display of data and features based on user roles. Successfully fetching and displaying proposals based on user roles and ensuring that admins could perform actions like updating status and deleting proposals was a rewarding result.
- Clean and Minimalistic Design: The clean, minimalistic design achieved through careful planning and wireframing helped the app focus on showcasing the illustrators. It was satisfying to see how well the design aligned with the original vision.

### Key Learnings/Takeaways
- Role-Based Access Control: I gained a solid understanding of role-based access control, both in terms of backend logic (filtering data based on user roles) and frontend logic (conditionally rendering UI elements). This is essential for building secure and scalable applications.
- Django and Django REST Framework: I became much more comfortable working with Django, Django REST Framework, and serializers for managing data flow between the backend and frontend. 

### Future Improvements
- Making the app mobile responsive.
- User's can favourite talent, user's favourited talent appears first in the drop down when selecting which talent the proposal is for.
- Even more error handling and validation
- Allowing users to customize their profiles, update their bio, profile picture, and other personal information. So the admin can get a better idea of who the proposal is coming from and the company
- The ability to search and filter proposals based on different criteria (e.g., project type, budget, status)

