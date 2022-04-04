import os

class Base:
    AUTO_REFRESH = os.getenv("AUTO_REFRESH") == "True"
    TEMPLATES_AUTO_RELOAD = os.getenv("TEMPLATES_AUTO_RELOAD") == "True"