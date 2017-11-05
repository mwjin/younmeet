from django.conf.urls import url
from user import views

urlpatterns = [
    url('^signup$', views.signup, name='signup'),
    url('^signin$', views.signin, name='signin'),
    url('^signout$', views.signout, name='signout'),
    url('^token$', views.token, name='token'),
    url('^user/(?P<user_id>[0-9]+)$', views.userDetail, name='userDetail'),
]
