'use client'

import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

const InputSchemaViewer = ({ schema }) => {
  const processedSchema = React.useMemo(() => {
    if (!schema) return null;
    if (schema?.["application/json"]?.schema) {
      return schema["application/json"].schema;
    }
    return schema;
  }, [schema]);

  const formatExample = (example) => {
    if (!example) return '';
    
    if (typeof example === 'object') {
      const stringified = JSON.stringify(example, null, 2);
      if (stringified.length > 150) {
        const firstLevel = Object.keys(example).reduce((acc, key) => {
          const value = example[key];
          acc[key] = Array.isArray(value) ? '[...]' : 
                     typeof value === 'object' ? '{...}' : 
                     value;
          return acc;
        }, {});
        return JSON.stringify(firstLevel, null, 2);
      }
      return stringified;
    }
    return String(example);
  };

  const cleanDescription = (description) => {
    if (!description) return '';
    return description
      .replace(/\u003Cbr\u003E/g, '\n')
      .replace(/\u003C\/li\u003E/g, '')
      .replace(/\u003Cli\u003E/g, '\n• ')
      .replace(/\u003C\/ul\u003E/g, '')
      .replace(/\u003Cul\u003E/g, '')
      .replace(/\u003Ca[^>]*\u003E/g, '')
      .replace(/\u003C\/a\u003E/g, '');
  };

  const renderAllOf = (allOfArray, depth) => {
    return allOfArray.map((schema, index) => (
      <div key={index} className="border-l-2 border-blue-100 pl-4 mt-4">
        <div className="text-sm text-gray-500 mb-2">Combined Schema {index + 1}:</div>
        {Object.entries(schema.properties || {}).map(([key, value]) => (
          <RenderSchema 
            key={key} 
            name={key} 
            schema={value} 
            depth={depth + 1}
            parentRequired={schema.required || []}
          />
        ))}
      </div>
    ));
  };

  const RenderSchema = ({ name, schema, depth = 0, isOneOfChild = false, parentRequired = [] }) => {
    if (!schema || typeof schema !== 'object') {
      return null;
    }

    const [isOpen, setIsOpen] = React.useState(true);
    const hasProperties = schema.properties && typeof schema.properties === 'object';
    const hasEnums = Array.isArray(schema.enum);
    const hasOneOf = Array.isArray(schema.oneOf);
    const hasAllOf = Array.isArray(schema.allOf);
    const shouldShowExample = !isOneOfChild && name !== 'output';
    const isRequired = parentRequired.includes(name) || schema.required?.includes(name);

    const renderArrayItems = (items, currentDepth) => {
      if (!items) return null;

      if (items.type === "string" || items.type === "number" || items.type === "boolean") {
        return (
          <div className="pl-6 mt-2">
            <div className="flex items-center">
              <span className="text-gray-500 text-sm">Array items: </span>
              <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-sm">
                {items.type}
              </span>
            </div>
          </div>
        );
      }
      
      if (items.properties || items.allOf) {
        return (
          <div className="pl-6 mt-2">
            <div className="text-sm text-gray-500 mb-2">Array items:</div>
            {items.allOf ? 
              renderAllOf(items.allOf, currentDepth + 1) :
              Object.entries(items.properties || {}).map(([key, value]) => (
                <RenderSchema 
                  key={key} 
                  name={key} 
                  schema={value} 
                  depth={currentDepth + 1} 
                  parentRequired={items.required || []}
                />
              ))
            }
          </div>
        );
      }
      
      return null;
    };

    const renderOneOf = () => {
      if (!hasOneOf) return null;

      return (
        <div className="mt-3">
          <div className="text-sm font-medium text-gray-600 mb-2">One of the following:</div>
          {schema.oneOf.map((subSchema, index) => {
            if (subSchema && typeof subSchema === 'object' && !('example' in subSchema)) {
              return (
                <div key={index} className="mb-4 border-l-2 border-blue-100 pl-4">
                  <RenderSchema
                    name={`Option ${index + 1}`}
                    schema={subSchema}
                    depth={depth + 1}
                    isOneOfChild={true}
                  />
                </div>
              );
            }
            return null;
          })}
        </div>
      );
    };

    return (
      <div className={`${depth > 0 ? 'ml-6' : ''} mb-4`}>
        <div 
          className="flex items-start cursor-pointer group" 
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="mt-1 mr-2 text-gray-400 group-hover:text-gray-600">
            {(hasProperties || hasEnums || hasOneOf || hasAllOf) && (
              isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center flex-wrap gap-2">
              <span className="font-semibold text-blue-600">{name}</span>
              {schema.type && (
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-sm">
                  {schema.type}
                </span>
              )}
              {isRequired && (
                <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded text-sm">
                  required
                </span>
              )}
            </div>
            
            {schema.description && (
              <p className="text-gray-600 mt-2 text-sm whitespace-pre-line">
                {cleanDescription(schema.description)}
              </p>
            )}
            
            {shouldShowExample && schema.example && (
              <div className="mt-2 text-sm">
                <span className="text-purple-600 font-medium">Example: </span>
                <code className="block bg-gray-50 px-3 py-2 rounded mt-1 overflow-x-auto max-w-full whitespace-pre font-mono text-sm">
                  {formatExample(schema.example)}
                </code>
              </div>
            )}

            {hasEnums && isOpen && (
              <div className="mt-2">
                <span className="text-sm font-medium text-gray-600">Enum values:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {schema.enum.map((value) => (
                    <span key={value} className="px-2 py-0.5 bg-gray-50 text-gray-600 rounded text-sm">
                      {value}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {isOpen && (
          <>
            {hasOneOf && renderOneOf()}
            {hasAllOf && renderAllOf(schema.allOf, depth)}
            {hasProperties && (
              <div className="mt-3 border-l-2 border-gray-100 pl-4">
                {Object.entries(schema.properties).map(([key, value]) => (
                  <RenderSchema 
                    key={key} 
                    name={key} 
                    schema={value} 
                    depth={depth + 1}
                    parentRequired={schema.required || []}
                  />
                ))}
              </div>
            )}
            {schema.items && renderArrayItems(schema.items, depth)}
          </>
        )}
      </div>
    );
  };

  if (!processedSchema) {
    return (
      <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow">
        <p className="text-gray-600">No schema data available</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-6 text-gray-800">API Schema Documentation</h2>
      <div>
        <RenderSchema 
          name="Root" 
          schema={processedSchema}
        />
      </div>
    </div>
  );
};

export default InputSchemaViewer;