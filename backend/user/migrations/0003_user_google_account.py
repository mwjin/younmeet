# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2017-11-03 13:25
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0002_auto_20171103_1316'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='google_account',
            field=models.EmailField(blank=True, max_length=254),
        ),
    ]
