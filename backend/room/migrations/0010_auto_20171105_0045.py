# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2017-11-04 15:45
from __future__ import unicode_literals

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('room', '0009_auto_20171105_0029'),
    ]

    operations = [
        migrations.AlterField(
            model_name='room',
            name='created_time',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]