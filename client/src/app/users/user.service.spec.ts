import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { User } from './user';
import { UserService } from './user.service';

describe('UserService', () => {
  // A small collection of test users
  const testUsers: User[] = [
    {
      _id: 'chris_id',
      name: 'Chris',
      age: 25,
      company: 'UMM',
      email: 'chris@this.that',
      role: 'admin',
      avatar: 'https://gravatar.com/avatar/8c9616d6cc5de638ea6920fb5d65fc6c?d=identicon',
    },
    {
      _id: 'pat_id',
      name: 'Pat',
      age: 37,
      company: 'IBM',
      email: 'pat@something.com',
      role: 'editor',
      avatar: 'https://gravatar.com/avatar/b42a11826c3bde672bce7e06ad729d44?d=identicon',
    },
    {
      _id: 'jamie_id',
      name: 'Jamie',
      age: 37,
      company: 'Frogs, Inc.',
      email: 'jamie@frogs.com',
      role: 'viewer',
      avatar: 'https://gravatar.com/avatar/d4a6c71dd9470ad4cf58f78c100258bf?d=identicon',
    },
  ];
  let userService: UserService;
  // These are used to mock the HTTP requests so that we (a) don't have to
  // have the server running and (b) we can check exactly which HTTP
  // requests were made to ensure that we're making the correct requests.
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    // Set up the mock handling of the HTTP requests
    TestBed.configureTestingModule({
      imports: [],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    // Construct an instance of the service with the mock
    // HTTP client.
    userService = new UserService(httpClient);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  describe('getUsers()', () => {
    it('calls `api/users` when `getUsers()` is called with no parameters', () => {
      // Assert that the users we get from this call to getUsers()
      // should be our set of test users. Because we're subscribing
      // to the result of getUsers(), this won't actually get
      // checked until the mocked HTTP request 'returns' a response.
      // This happens when we call req.flush(testUsers) a few lines
      // down.
      userService.getUsers().subscribe(users => expect(users).toBe(testUsers));

      // Specify that (exactly) one request will be made to the specified URL.
      const req = httpTestingController.expectOne(userService.userUrl);
      // Check that the request made to that URL was a GET request.
      expect(req.request.method).toEqual('GET');
      // Check that the request had no query parameters.
      expect(req.request.params.keys().length).toBe(0);
      // Specify the content of the response to that request. This
      // triggers the subscribe above, which leads to that check
      // actually being performed.
      req.flush(testUsers);
    });

    describe('Calling getUsers() with parameters correctly forms the HTTP request', () => {
      /*
       * We really don't care what `getUsers()` returns in the cases
       * where the filtering is happening on the server. Since all the
       * filtering is happening on the server, `getUsers()` is really
       * just a "pass through" that returns whatever it receives, without
       * any "post processing" or manipulation. So the tests in this
       * `describe` block all confirm that the HTTP request is properly formed
       * and sent out in the world, but don't _really_ care about
       * what `getUsers()` returns as long as it's what the HTTP
       * request returns.
       *
       * So in each of these tests, we'll keep it simple and have
       * the (mocked) HTTP request return the entire list `testUsers`
       * even though in "real life" we would expect the server to
       * return return a filtered subset of the users.
       */

      it("correctly calls api/users with filter parameter 'admin'", () => {
        userService.getUsers({ role: 'admin' }).subscribe(users => expect(users).toBe(testUsers));

        // Specify that (exactly) one request will be made to the specified URL with the role parameter.
        const req = httpTestingController.expectOne(
          request => request.url.startsWith(userService.userUrl) && request.params.has('role')
        );

        // Check that the request made to that URL was a GET request.
        expect(req.request.method).toEqual('GET');

        // Check that the role parameter was 'admin'
        expect(req.request.params.get('role')).toEqual('admin');

        req.flush(testUsers);
      });

      it("correctly calls api/users with filter parameter 'age'", () => {
        userService.getUsers({ age: 25 }).subscribe(users => expect(users).toBe(testUsers));

        // Specify that (exactly) one request will be made to the specified URL with the age parameter.
        const req = httpTestingController.expectOne(
          request => request.url.startsWith(userService.userUrl) && request.params.has('age')
        );

        // Check that the request made to that URL was a GET request.
        expect(req.request.method).toEqual('GET');

        // Check that the age parameter was '25'
        expect(req.request.params.get('age')).toEqual('25');

        req.flush(testUsers);
      });

      it('correctly calls api/users with multiple filter parameters', () => {
        userService
          .getUsers({ role: 'editor', company: 'IBM', age: 37 })
          .subscribe(users => expect(users).toBe(testUsers));

        // Specify that (exactly) one request will be made to the specified URL with the role parameter.
        const req = httpTestingController.expectOne(
          request =>
            request.url.startsWith(userService.userUrl) &&
            request.params.has('role') &&
            request.params.has('company') &&
            request.params.has('age')
        );

        // Check that the request made to that URL was a GET request.
        expect(req.request.method).toEqual('GET');

        // Check that the role, company, and age parameters are correct
        expect(req.request.params.get('role')).toEqual('editor');
        expect(req.request.params.get('company')).toEqual('IBM');
        expect(req.request.params.get('age')).toEqual('37');

        req.flush(testUsers);
      });
    });
  });

  describe('getUserByID()', () => {
    it('calls api/users/id with the correct ID', () => {
      // We're just picking a User "at random" from our little
      // set of Users up at the top.
      const targetUser: User = testUsers[1];
      const targetId: string = targetUser._id;

      userService.getUserById(targetId).subscribe(
        // This `expect` doesn't do a _whole_ lot.
        // Since the `targetUser`
        // is what the mock `HttpClient` returns in the
        // `req.flush(targetUser)` line below, this
        // really just confirms that `getUserById()`
        // doesn't in some way modify the user it
        // gets back from the server.
        user => expect(user).toBe(targetUser)
      );

      const expectedUrl: string = userService.userUrl + '/' + targetId;
      const req = httpTestingController.expectOne(expectedUrl);
      expect(req.request.method).toEqual('GET');

      req.flush(targetUser);
    });
  });

  describe('filterUsers()', () => {
    /*
     * Since `filterUsers` actually filters "locally" (in
     * Angular instead of on the server), we do want to
     * confirm that everything it returns has the desired
     * properties. Since this doesn't make a call to the server,
     * though, we don't have to use the mock HttpClient and
     * all those complications.
     */
    it('filters by name', () => {
      const userName = 'i';
      const filteredUsers = userService.filterUsers(testUsers, { name: userName });
      // There should be two users with an 'i' in their
      // name: Chris and Jamie.
      expect(filteredUsers.length).toBe(2);
      // Every returned user's name should contain an 'i'.
      filteredUsers.forEach(user => {
        expect(user.name.indexOf(userName)).toBeGreaterThanOrEqual(0);
      });
    });

    it('filters by company', () => {
      const userCompany = 'UMM';
      const filteredUsers = userService.filterUsers(testUsers, { company: userCompany });
      // There should be just one user that has UMM as their company.
      expect(filteredUsers.length).toBe(1);
      // Every returned user's company should contain 'UMM'.
      filteredUsers.forEach(user => {
        expect(user.company.indexOf(userCompany)).toBeGreaterThanOrEqual(0);
      });
    });

    it('filters by name and company', () => {
      // There's only one user (Chris) whose name
      // contains an 'i' and whose company contains
      // an 'M'. There are two whose name contains
      // an 'i' and two whose company contains an
      // an 'M', so this should test combined filtering.
      const userName = 'i';
      const userCompany = 'M';
      const filters = { name: userName, company: userCompany };
      const filteredUsers = userService.filterUsers(testUsers, filters);
      // There should be just one user with these properties.
      expect(filteredUsers.length).toBe(1);
      // Every returned user should have _both_ these properties.
      filteredUsers.forEach(user => {
        expect(user.name.indexOf(userName)).toBeGreaterThanOrEqual(0);
        expect(user.company.indexOf(userCompany)).toBeGreaterThanOrEqual(0);
      });
    });
  });
});



