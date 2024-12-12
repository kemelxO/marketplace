from rest_framework import serializers
from webapp.models import Category, Ads


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class AdsSerializer(serializers.ModelSerializer):
    category_id = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), source='category', write_only=True)
    category = serializers.StringRelatedField(read_only=True)
    author = serializers.StringRelatedField(read_only=True)
    author_id = serializers.IntegerField(source='author.id', read_only=True)

    class Meta:
        model = Ads
        fields = [
            'id', 'title', 'description', 'photo', 'price', 'created_at', 'author_id',
            'updated_at', 'published_at', 'status', 'category', 'category_id', 'author',
        ]

