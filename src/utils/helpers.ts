/**
 * retorna valor informado sem acentuação
 * @date 2020-07-06
 * @param {any} str=''
 * @returns {any}
 */
export function removeAccents(str = '') {
  const accents =
    'ÀÁÂÃÄÅĄàáâãäåąßÒÓÔÕÕÖØÓòóôõöøóÈÉÊËĘèéêëęðÇĆçćÐÌÍÎÏìíîïÙÚÛÜùúûüÑŃñńŠŚšśŸÿýŽŻŹžżź';
  const accentsOut =
    'AAAAAAAaaaaaaaBOOOOOOOOoooooooEEEEEeeeeeeCCccDIIIIiiiiUUUUuuuuNNnnSSssYyyZZZzzz';
  return str
    .split('')
    .map(letter => {
      const accentIndex = accents.indexOf(letter);
      return accentIndex !== -1 ? accentsOut[accentIndex] : letter;
    })
    .join('');
}

/**
 * verifica se em uma string contem o valor informado sem acentuação e com lowerCase
 * @date 2020-07-06
 * @param {string} str texto ou palavra que vai ser comparada
 * @param {string} value valor verificação
 * @returns {boolean}
 */
export function searchStr(str: string, value: string) {
  str = removeAccents(str?.toLocaleLowerCase());
  value = removeAccents(value.toLocaleLowerCase());
  return !!str.includes(value);
}

export function objectIsEqual(obj1: any, obj2: any): boolean {
  // removendo undefined values
  obj1 = JSON.parse(JSON.stringify(obj1));
  obj2 = JSON.parse(JSON.stringify(obj2));

  // transformando para string
  obj1 = JSON.stringify(obj1);
  obj2 = JSON.stringify(obj2);

  return obj1 === obj2
}
