from rest_framework import serializers
from . models import *
from . enums import RecipeFlags

class RecipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipe
        fields = ['id', 'owner', 'name', 'preparation_time', 'description', 'flags']

class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ['id', 'recipeId', 'name', 'quantity', 'unit']

class IngredientInputSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ['name', 'quantity', 'unit']

class CookingStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = CookingStep
        fields = ['id', 'recipeId', 'number', 'instruction']

class CookingStepInputSerializer(serializers.ModelSerializer):
    step_number = serializers.IntegerField(source='number')

    class Meta:
        model = CookingStep
        fields = ['step_number', 'instruction']

class RecipeReturnModelSerializer(serializers.ModelSerializer):
    preparationTime = serializers.SerializerMethodField()
    ingredients = serializers.SerializerMethodField()
    steps = serializers.SerializerMethodField()
    
    class Meta:
        model = Recipe
        fields = ['id', 'owner', 'name', 'preparationTime', 'description', 'ingredients', 'steps']
        
    def get_preparationTime(self, obj):
        return str(obj.preparation_time) + ' minutes'
    
    def get_ingredients(self, obj):
        return [
            f"{ingredient.quantity} {ingredient.unit} {ingredient.name}"
            for ingredient in obj.ingredients.all()
        ]
    
    def get_steps(self, obj):
        return [
            f"{step.number}. {step.instruction}"
            for step in obj.cooking_steps.all()
        ]
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)

        representation['isBreakfast'] = instance.flags & RecipeFlags.IS_BREAKFAST != 0
        representation['isLunch'] = instance.flags & RecipeFlags.IS_LUNCH != 0
        representation['isDinner'] = instance.flags & RecipeFlags.IS_DINNER != 0
        representation['isLong'] = instance.flags & RecipeFlags.IS_LONG != 0

        return representation
    
class RecipeInputQuerySerializer(serializers.ModelSerializer):
    ingredients = IngredientInputSerializer(many=True)
    steps = CookingStepInputSerializer(many=True)

    class Meta:
        model = Recipe
        fields = ['name', 'preparation_time', 'description', 'ingredients', 'steps']
    
    def create(self, validated_data):
        # Assign the owner (request.user) to the post before saving
        user = self.context['request'].user
        ingredients_data = validated_data.pop('ingredients')
        steps_data = validated_data.pop('steps')
        
        # Create the Recipe instance
        recipe = Recipe.objects.create(owner=user, **validated_data)

        # Create related ingredients
        for ingredient_data in ingredients_data:
            Ingredient.objects.create(recipeId=recipe, **ingredient_data)

        # Create related cooking steps
        for step_data in steps_data:
            CookingStep.objects.create(recipeId=recipe, **step_data)

        return recipe

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['question']

class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['questionId', 'answer']

    def create(self, validated_data):
        # Assign the owner (request.user) to the post before saving
        user = self.context['request'].user
        post = Answer.objects.create(userId=user, **validated_data)
        return post