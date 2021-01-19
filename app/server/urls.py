from django.urls import path

from .views import GeocodeForAddress, AddressForGeocode


urlpatterns = [
    path('geocode/', GeocodeForAddress.as_view(), name='geocode-for-address'),
    path('address/', AddressForGeocode.as_view(), name='address-for-geocode'),
]
