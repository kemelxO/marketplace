# Generated by Django 5.1 on 2024-08-31 16:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('webapp', '0005_alter_ads_published_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ads',
            name='published_at',
            field=models.DateTimeField(blank=True, null=True, verbose_name='Дата публикации'),
        ),
    ]
