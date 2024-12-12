from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone
from phonenumber_field.modelfields import PhoneNumberField
from webapp.enums import CATEGORY_CHOICES


class Profile(models.Model):
    user = models.OneToOneField(User, related_name='profile', on_delete=models.CASCADE, verbose_name='Пользователь')
    phone_number = PhoneNumberField(verbose_name="Номер Телефона")

    class Meta:
        db_table = 'ads_profile'
        verbose_name = 'Профиль'
        verbose_name_plural = 'Профили'

    def __str__(self):
        return self.user.username


class Category(models.Model):
    name = models.CharField(max_length=100, choices=CATEGORY_CHOICES, verbose_name='Категории')

    class Meta:
        db_table = 'ads_category'

    def __str__(self):
        return "{}".format(self.name)


class Ads(models.Model):
    STATUS_CHOICES = [
        ('draft', 'На модерацию'),
        ('published', 'Опубликовано'),
        ('rejected', 'Откланено'),
    ]

    author = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='ads', verbose_name='Автор')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='ads', verbose_name='Категория')
    title = models.CharField(max_length=200, null=False, blank=False, verbose_name='Заголовок')
    description = models.TextField(max_length=5000, null=True, blank=True, verbose_name='Текст')
    photo = models.ImageField(upload_to='ads/', null=True, blank=True, verbose_name='Фото')
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, verbose_name='Цена')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")
    published_at = models.DateTimeField(null=True, blank=True, verbose_name="Дата публикации")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft', verbose_name='Статус')
    is_delete = models.BooleanField(default=False)

    def delete(self, using=None, keep_parents=False):
        self.is_delete = True
        self.save(update_fields=['is_delete'])

    def save(self, *args, **kwargs):
        if self.status == 'published' and not self.published_at:
            self.published_at = timezone.now()
        super().save(*args, **kwargs)

    class Meta:
        db_table = 'ads_ads'

    def __str__(self):
        return "{}. {}".format(self.pk, self.title)
