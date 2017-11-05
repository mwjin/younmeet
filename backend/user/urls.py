from django.conf.urls import url
from user import views

urlpatterns = [
    url('^signup$', views.signup, name='signup'),
    url('^signin$', views.signin, name='signin'),
    url('^signout$', views.signout, name='signout'),
    url('^user$', views.userDetail, name='userDetail'),
    url('^user/owned-rooms$', views.userOwnedRoomList, name='userOwnedRoomList'),
    url('^user/joined-rooms$', views.userJoinedRoomList, name='userJoinedRoomList'),
]
