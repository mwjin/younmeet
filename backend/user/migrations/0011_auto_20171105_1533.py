# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2017-11-05 06:33
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0010_auto_20171105_1532'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='username',
            field=models.CharField(max_length=64, unique=True, verbose_name='Username'),
        ),
    ]