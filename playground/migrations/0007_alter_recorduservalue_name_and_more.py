# Generated by Django 4.2.1 on 2023-05-28 08:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('playground', '0006_recorduservalue_name_sumofgroupperuser_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='recorduservalue',
            name='name',
            field=models.CharField(default='', max_length=100),
        ),
        migrations.AlterField(
            model_name='sumofgroupperuser',
            name='name',
            field=models.CharField(default='', max_length=100),
        ),
    ]