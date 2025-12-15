import os
from ibmcloudant.cloudant_v1 import CloudantV1
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator

def get_cloudant():
    authenticator = IAMAuthenticator(os.getenv("CLOUDANT_APIKEY"))

    cloudant = CloudantV1(authenticator=authenticator)
    cloudant.set_service_url(os.getenv("CLOUDANT_URL"))

    return cloudant
