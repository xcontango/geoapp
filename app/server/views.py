import requests
import json
from django.conf import settings
from rest_framework import views
from rest_framework.authentication import SessionAuthentication
from rest_framework.response import Response

MAP_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json'


class GeocodeForAddress(views.APIView):
    # TODO: add serializer, auth
    authentication_classes = [SessionAuthentication]

    def get(self, request, *args, **kwargs):
        data = google_geocode_query(request.GET.get('address') or '')
        return Response(status=200, data=data)


class AddressForGeocode(views.APIView):
    # TODO: add serializer
    authentication_classes = [SessionAuthentication]

    def get(self, request, *args, **kwargs):
        data = google_address_query(request.GET.get('geocode') or '')
        return Response(status=200, data=data)


def google_geocode_query(address):
    # Don't throw an error if not given an input
    return_data = {'results': []}

    if not address:
        return return_data
    if not settings.GOOGLE_API_KEY:
        return_data['results'] = fake_results()
        return return_data

    request_data = {
        'key': settings.GOOGLE_API_KEY,
        'address': address,
    }

    try:
        rsp = requests.get(MAP_API_URL, params=request_data)
        if rsp.status_code == 200:
            results = rsp.json().get('results')
            for result in results:
                formatted_address = result.get('formatted_address')
                location = result.get('geometry', {}).get('location', {})
                # Use the address and (lat, lng)
                if formatted_address and len(location) == 2:
                    geocode = f'{location["lat"]} {location["lng"]}'
                    return_data['results'].append({
                        'formatted_address': formatted_address,
                        'geocode': geocode,
                        'location': location,
                    })
        return return_data
    except:
        return {'error': 'Error connecting to Google map API'}


def google_address_query(geocode):
    return_data = {'results': []}

    # Check that a pair of numbers was given
    try:
        geocode = [format(float(x), '14.8f') for x in geocode.replace(',', ' ').split()]
    except:
        return return_data

    # Don't throw an error if not given
    if not geocode or len(geocode) != 2:
        return return_data
    if not settings.GOOGLE_API_KEY:
        return_data['results'] = fake_results()
        return return_data

    request_data = {
        'key': settings.GOOGLE_API_KEY,
        'latlng': ','.join(geocode),
    }

    try:
        rsp = requests.get(MAP_API_URL, params=request_data)
        if rsp.status_code == 200:
            results = rsp.json().get('results')
            for result in results:
                formatted_address = result.get('formatted_address')
                location = result.get('geometry', {}).get('location', {})
                # Use the address and (lat, lng)
                if formatted_address and len(location) == 2:
                    geocode = f'{location["lat"]} {location["lng"]}'
                    return_data['results'].append({
                        'formatted_address': formatted_address,
                        'geocode': geocode,
                        'location': location,
                    })
        return return_data
    except:
        return {'error': 'Error connecting to Google map API'}


def fake_results():
    # TODO: use faker
    return [{
        'formatted_address': '123 South Main St, Seattle, WA 98104, USA',
        'geocode': '47.6000372 -122.3336471',
        'location': {
            'lat': 47.6000372,
            'lng': -122.3336471
        }
    }, {
        'formatted_address': '11 Broadway, New York, NY 10004, USA',
        'geocode': '40.70527209999999 -74.0139676',
        'location': {
            'lat': 40.70527209999999,
            'lng': -74.0139676
        }
    }]