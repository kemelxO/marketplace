# Generated by Django 5.1 on 2024-08-31 11:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('webapp', '0002_alter_profile_phone_number'),
    ]

    operations = [
        migrations.AddField(
            model_name='ads',
            name='status',
            field=models.CharField(choices=[('draft', 'На модерацию'), ('published', 'Опубликовано'), ('rejected', 'Откланено')], default='draft', max_length=20, verbose_name='Статус'),
        ),
    ]
