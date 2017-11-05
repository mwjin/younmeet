from django.contrib.auth.models import User
from django.test import TestCase, Client
from user.models import User
import json

# Create your tests here.
class UserTestCase(TestCase):
    def setUp(self):
        User.objects.create_user(email='minu@snu.ac.kr', password='1234')
        User.objects.create_user(email='taebum@snu.ac.kr', password='1234')

        self.client = Client(enforce_csrf_checks=True)

    # region test view.py
    def test_csrf(self):
        # By default, csrf checks are disabled in test client
        # To test csrf protection we enforce csrf checks here
        client = Client(enforce_csrf_checks=True)
        response = client.post('/api/signup',
                               json.dumps({'email': 'chris@snu.ac.kr', 'password': 'chris'}),
                               content_type='application/json')
        self.assertEqual(response.status_code, 403) # Request without csrf token returns 403 response

        response = client.get('/api/token')
        csrftoken = response.cookies['csrftoken'].value # Get csrf token from cookie

        response = client.post('/api/signup',
                               json.dumps({'email': 'chris@snu.ac.kr', 'password': 'chris'}),
                               content_type='application/json',
                               HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 201) # Pass csrf protection

    def test_csrf_invalid_methods(self):
        response = self.client.get('/api/token')
        csrftoken = response.cookies['csrftoken'].value

        response = self.client.post('/api/token', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 405) # Pass csrf protection

        response = self.client.put('/api/token', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 405) # Pass csrf protection

        response = self.client.delete('/api/token', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 405) # Pass csrf protection

    def test_signup_post(self):
        response = self.client.get('/api/token')
        csrftoken = response.cookies['csrftoken'].value

        response = self.client.post('/api/signup',
                                    json.dumps({'email': 'dongsu@snu.ac.kr', 'password': '1234'}),
                                    content_type='application/json',
                                    HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 201)

    def test_signup_invalid_methods(self):
        response = self.client.get('/api/token')
        csrftoken = response.cookies['csrftoken'].value

        response = self.client.get('/api/signup')
        self.assertEqual(response.status_code, 405)

        response = self.client.put('/api/signup',
                                   json.dumps({'email': 'test@snu.ac.kr', 'password': 'hello'}),
                                   content_type='application/json',
                                   HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 405)

        response = self.client.delete('/api/signup',
                                      json.dumps({'email': 'test@snu.ac.kr', 'password': 'hello'}),
                                      content_type='application/json',
                                      HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 405)

    def test_signin_post(self):
        response = self.client.get('/api/token')
        csrftoken = response.cookies['csrftoken'].value

        response = self.client.post('/api/signin',
                                    json.dumps({'email': 'minu@snu.ac.kr', 'password': '1234'}),
                                    content_type='application/json',
                                    HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 200)

    def test_signin_post_fail(self):
        response = self.client.get('/api/token')
        csrftoken = response.cookies['csrftoken'].value

        response = self.client.post('/api/signin', json.dumps({'email': 'philsik@snu.ac.kr', 'password': '1234'}), content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 401)

    def test_signin_invalid_methods(self):
        response = self.client.get('/api/token')
        csrftoken = response.cookies['csrftoken'].value

        response = self.client.get('/api/signin')
        self.assertEqual(response.status_code, 405)

        response = self.client.put('/api/signin',
                                   json.dumps({'email': 'test@snu.ac.kr', 'password': 'hello'}),
                                   content_type='application/json',
                                   HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 405)

        response = self.client.delete('/api/signin',
                                      json.dumps({'email': 'test@snu.ac.kr', 'password': 'hello'}),
                                      content_type='application/json',
                                      HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 405)

    def test_signout_get(self):
        self.client.login(email='minu@snu.ac.kr', password='1234')

        response = self.client.get('/api/signout')
        self.assertEqual(response.status_code, 200)

    def test_signout_get_unauth(self):
        response = self.client.get('/api/signout')
        self.assertEqual(response.status_code, 401)

    def test_signout_invalid_methods(self):
        self.client.login(email='minu@snu.ac.kr', password='1234')

        response = self.client.get('/api/token')
        csrftoken = response.cookies['csrftoken'].value

        response = self.client.post('/api/signout',
                                    json.dumps({'email': 'invalid@snu.ac.kr', 'password': 'invalid'}),
                                    content_type='application/json',
                                    HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 405)

        response = self.client.put('/api/signout',
                                   json.dumps({'email': 'invalid@snu.ac.kr', 'password': 'invalid'}),
                                   content_type='application/json',
                                   HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 405)

        response = self.client.delete('/api/signout',
                                      json.dumps({'email': 'invalid@snu.ac.kr', 'password': 'invalid'}),
                                      content_type='application/json',
                                      HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 405)

    def test_user_detail_unauth(self):
        self.client.login(email='dongsu@snu.ac.kr', password='1234')

        response = self.client.get('/api/token')
        csrftoken = response.cookies['csrftoken'].value

        response = self.client.get('/api/user/1')
        self.assertEqual(response.status_code, 401)  # Unauthorized

        response = self.client.put('/api/user/1', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 401)

        response = self.client.delete('/api/user/1', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 401)

    def test_user_detail_get(self):
        self.client.login(email='minu@snu.ac.kr', password='1234')

        response = self.client.get('/api/user/1')

        data = json.loads(response.content.decode())
        self.assertEqual(data['email'], 'minu@snu.ac.kr')
        self.assertEqual(response.status_code, 200)

    def test_user_detail_get_not_found(self):
        self.client.login(email='minu@snu.ac.kr', password='1234')

        response = self.client.get('/api/user/4')
        self.assertEqual(response.status_code, 404)

    def test_user_detail_get_forbidden(self):
        self.client.login(email='taebum@snu.ac.kr', password='1234')

        response = self.client.get('/api/user/1')

        self.assertEqual(response.status_code, 403)

    def test_user_detail_post(self):
        self.client.login(email='minu@snu.ac.kr', password='1234')

        response = self.client.get('/api/token')
        csrftoken = response.cookies['csrftoken'].value

        response = self.client.post('/api/user/1',
                                    json.dumps({'password': '123456'}),
                                    content_type='application/json',
                                    HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 405)  # Not allowed method

    def test_user_detail_put(self):
        self.client.login(email='minu@snu.ac.kr', password='1234')

        response = self.client.get('/api/token')
        csrftoken = response.cookies['csrftoken'].value

        response = self.client.put('/api/user/1',
                                   json.dumps({'password': '123456'}),
                                   content_type='application/json',
                                   HTTP_X_CSRFTOKEN=csrftoken)

        self.assertTrue(User.objects.get(id=1).check_password('123456'))
        self.assertEqual(response.status_code, 204)

    def test_user_detail_put_not_found(self):
        self.client.login(email='minu@snu.ac.kr', password='1234')

        response = self.client.get('/api/token')
        csrftoken = response.cookies['csrftoken'].value

        response = self.client.put('/api/user/4',
                                   json.dumps({'password': '123456'}),
                                   content_type='application/json',
                                   HTTP_X_CSRFTOKEN=csrftoken)

        self.assertEqual(response.status_code, 404)

    def test_user_detail_put_forbidden(self):
        self.client.login(email='taebum@snu.ac.kr', password='1234')

        response = self.client.get('/api/token')
        csrftoken = response.cookies['csrftoken'].value

        response = self.client.put('/api/user/1',
                                   json.dumps({'password': '123456'}),
                                   content_type='application/json',
                                   HTTP_X_CSRFTOKEN=csrftoken)

        self.assertEqual(response.status_code, 403)

    def test_user_detail_delete(self):
        self.client.login(email='minu@snu.ac.kr', password='1234')

        response = self.client.get('/api/token')
        csrftoken = response.cookies['csrftoken'].value

        response = self.client.delete('/api/user/1', HTTP_X_CSRFTOKEN=csrftoken)

        self.assertRaises(User.DoesNotExist, User.objects.get, id=1)
        self.assertEqual(response.status_code, 204)

    def test_user_detail_delete_not_found(self):
        self.client.login(email='minu@snu.ac.kr', password='1234')

        response = self.client.get('/api/token')
        csrftoken = response.cookies['csrftoken'].value

        response = self.client.delete('/api/user/4', HTTP_X_CSRFTOKEN=csrftoken)

        self.assertEqual(response.status_code, 404)

    def test_user_detail_delete_forbidden(self):
        self.client.login(email='minu@snu.ac.kr', password='1234')

        response = self.client.get('/api/token')
        csrftoken = response.cookies['csrftoken'].value

        response = self.client.delete('/api/user/2', HTTP_X_CSRFTOKEN=csrftoken)

        self.assertEqual(response.status_code, 403)

    # endregion

    # region test models.py
    def test_create_superuser(self):
        superuser = User.objects.create_superuser(email='superman@snu.ac.kr', password='super')

        self.assertTrue(superuser.is_staff)
        self.assertTrue(superuser.is_superuser)

    def test_create_superuser_fail(self):
        with self.assertRaises(ValueError):
            User.objects.create_superuser(email='superman@snu.ac.kr', password='super', is_staff=False)

        with self.assertRaises(ValueError):
            User.objects.create_superuser(email='superman@snu.ac.kr', password='super', is_superuser=False)

    def test_create_user_no_email(self):
        with self.assertRaises(ValueError):
            User.objects.create_user(email=None, password='1234')

    def test_create_user_no_password(self):
        with self.assertRaises(ValueError):
            User.objects.create_user(email='philsik@snu.ac.kr', password=None)

    #  endregion
