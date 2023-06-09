# Generated by Django 4.2.1 on 2023-05-28 06:20

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('playground', '0003_user_email_user_password_alter_group_name_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Record',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default='', max_length=100)),
                ('createdAt', models.DateTimeField(verbose_name='created at')),
                ('updatedAt', models.DateTimeField(verbose_name='updated at')),
            ],
        ),
        migrations.CreateModel(
            name='RecordUserValue',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('value', models.CharField(default='', max_length=100)),
                ('recordid', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='playground.record')),
            ],
        ),
        migrations.CreateModel(
            name='SumOfGroupPerUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('value', models.CharField(default='', max_length=100)),
            ],
        ),
        migrations.RemoveField(
            model_name='user',
            name='groups',
        ),
        migrations.AddField(
            model_name='group',
            name='users',
            field=models.ManyToManyField(related_name='groups', to='playground.user'),
        ),
        migrations.DeleteModel(
            name='Choice',
        ),
        migrations.DeleteModel(
            name='Question',
        ),
        migrations.AddField(
            model_name='sumofgroupperuser',
            name='groupid',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='playground.group'),
        ),
        migrations.AddField(
            model_name='sumofgroupperuser',
            name='userid',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='playground.user'),
        ),
        migrations.AddField(
            model_name='recorduservalue',
            name='userid',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='playground.user'),
        ),
        migrations.AddField(
            model_name='record',
            name='creator',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='playground.user'),
        ),
        migrations.AddField(
            model_name='group',
            name='records',
            field=models.ManyToManyField(related_name='groups', to='playground.record'),
        ),
    ]
