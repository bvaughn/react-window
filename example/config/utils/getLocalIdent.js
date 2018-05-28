const loaderUtils = require('loader-utils');

const allowedCharactersFirst = "abcdefhijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const allowedCharactersAfter = allowedCharactersFirst + "0123456789-_";

const blacklist = [/^ad$/];
const idents = new Map();
let indexes = [0];

const getNextIdent = key => {
	const usedIdents = Array.from(idents.values());
	let ident = "";

	do {
		ident = indexes
			.map((i, arrIndex) => {
				// Limit the index for allowedCharactersFirst to it's maximum index.
				const maxIndexFirst = Math.min(i, allowedCharactersFirst.length - 1);

				return arrIndex === 0 ? allowedCharactersFirst[maxIndexFirst] : allowedCharactersAfter[i]
			})
			.join("");

		let i = indexes.length;
		while (i--) {
			indexes[i] += 1;

			if (indexes[i] === allowedCharactersAfter.length) {
				indexes[i] = 0;

				if (i === 0) indexes.push(0);
			} else break;
		}
	} while (usedIdents.includes(ident) || blacklist.some(regex => ident.match(regex)));

	idents.set(key, ident);
	return ident;
};

module.exports = function getLocalIdent(
  context,
  localIdentName,
  localName,
  options
) {
  // Create a hash based on a the file location and class name. Will be unique across a project, and close to globally unique.
  const hash = loaderUtils.getHashDigest(
    context.resourcePath + localName,
    'md5',
    'base64',
    5
  );

	return idents.get(hash) || getNextIdent(hash);
};