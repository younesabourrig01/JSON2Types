const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const getPrimitiveType = (value: unknown): string => {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
};

/**
 * Converts JSON data into a TS interface.
 *
 * @param jsonInput - The JSON data to convert
 * @param rootName - The name of the Interface (default RootPayload)
 */

export const generateTypeScriptInterfaces = (
  jsonInput: unknown,
  rootName: string = "RootPayload",
): string => {
  if (!jsonInput || typeof jsonInput !== "object" || Array.isArray(jsonInput)) {
    return `// Invalid JSON object provided\ntype ${rootName} = ${getPrimitiveType(jsonInput)};`;
  }

  const generatedInterfaces: string[] = [];

  const parseObject = (
    obj: Record<string, unknown>,
    interfaceName: string,
  ): string => {
    const lines: string[] = [];

    for (const [key, value] of Object.entries(obj)) {
      const valueType = getPrimitiveType(value);

      if (valueType === "array") {
        const arr = value as unknown[];
        if (arr.length === 0) {
          lines.push(`  ${key}: any[];`);
        } else {
          const firstItemType = getPrimitiveType(arr[0]);
          if (firstItemType === "object") {
            const nestedName = `${capitalize(key)}Item`;
            parseObject(arr[0] as Record<string, unknown>, nestedName);
            lines.push(`  ${key}: ${nestedName}[];`);
          } else {
            lines.push(`  ${key}: ${firstItemType}[];`);
          }
        }
      } else if (valueType === "object") {
        const nestedName = capitalize(key);
        parseObject(value as Record<string, unknown>, nestedName);
        lines.push(`  ${key}: ${nestedName};`);
      } else {
        lines.push(`  ${key}: ${valueType};`);
      }
    }

    const interfaceCode = `export interface ${interfaceName} {\n${lines.join("\n")}\n}`;
    generatedInterfaces.unshift(interfaceCode);
    return interfaceName;
  };

  parseObject(jsonInput as Record<string, unknown>, rootName);

  return generatedInterfaces.join("\n\n");
};
