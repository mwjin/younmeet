# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2017-11-05 14:48
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('room', '0015_auto_20171105_1407'),
    ]

    operations = [
        migrations.AlterField(
            model_name='room',
            name='min_time_required',
            field=models.DurationField(blank=True, null=True),
        ),
    ]
