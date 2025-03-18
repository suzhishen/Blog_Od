# Copyright 2023 ACSONE SA/NV
# License LGPL-3.0 or later (http://www.gnu.org/licenses/LGPL).
"""
The demo router is a router that demonstrates how to use the fastapi
integration with odoo.
"""
from typing import Annotated

from odoo.api import Environment
from odoo.exceptions import AccessError, MissingError, UserError, ValidationError

from odoo.addons.base.models.res_partner import Partner

from fastapi import APIRouter, Depends, HTTPException, status

from ..dependencies import authenticated_partner, fastapi_endpoint, odoo_env
from ..models import FastapiEndpoint
from ..schemas import DemoEndpointAppInfo, DemoExceptionType, DemoUserInfo
# create a router

router = APIRouter(tags=["demo1"])


@router.get("/demo1")
async def hello_word1():
    """Hello World!"""
    return {"Hello": "get"}

@router.post("/demo1")
async def hello_word():
    """Hello World!"""
    return {"Hello": "post"}

@router.put("/demo1")
async def hello_word():
    """Hello World!"""
    return {"Hello": "put"}

@router.delete("/demo1")
async def hello_word():
    """Hello World!"""
    return {"Hello": "delete"}