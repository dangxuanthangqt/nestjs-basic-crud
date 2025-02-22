import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsPasswordMatch(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'matchPassword',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: string, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints as string[];
          const relatedValue = (args.object as Record<string, unknown>)[
            relatedPropertyName
          ];
          return (
            typeof value === 'string' &&
            typeof relatedValue === 'string' &&
            value === relatedValue
          );
        },
        defaultMessage(args: ValidationArguments) {
          console.log('args', args);
          return `${args.property} must match ${args.constraints[0]}.`;
        },
      },
    });
  };
}
