from django.conf.urls import url
from user import views

urlpatterns = [
    url('^signup$', views.signup, name='signup'),
    url('^signin$', views.signin, name='signin'),
    url('^signout$', views.signout, name='signout'),
    url('^user$', views.user_detail, name='user_detail'),
    url('^user/owned-rooms$', views.user_owned_room_list, name='user_owned_room_list'),
    url('^user/joined-rooms$', views.user_joined_room_list, name='user_joined_room_list'),
    url('^user/check-password$', views.check_password, name='check_password'),
]
