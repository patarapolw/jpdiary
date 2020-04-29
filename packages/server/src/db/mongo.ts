import { getModelForClass, prop, index } from '@typegoose/typegoose'

class DbSentence {
  @prop() _id!: number
  @prop({ required: true }) lang!: string
  @prop({ required: true }) text!: string
  @prop() segments?: string[]
}

export const DbSentenceModel = getModelForClass(DbSentence, { schemaOptions: { collection: 'sentence' } })

@index({ sentenceId: 1, translationId: 1 }, { unique: true })
class DbTranslation {
  @prop() sentenceId!: number
  @prop() translationId!: number
}

export const DbTranslationModel = getModelForClass(DbTranslation, { schemaOptions: { collection: 'translation' } })

@index({ sentenceId: 1, tagName: 1 }, { unique: true })
class DbSentenceTag {
  @prop() sentenceId!: number
  @prop() tagName!: string
}

export const DbSentenceTagModel = getModelForClass(DbSentenceTag, { schemaOptions: { collection: 'sentenceTag' } })

class DbVocab {
  @prop() kanji!: string[]
  @prop() readings!: string[]
  @prop() info!: string[]
  @prop() meanings!: string[]
  @prop() ent_seq!: string
}

export const DbVocabModel = getModelForClass(DbVocab, { schemaOptions: { collection: 'vocab' } })

class DbCharacter {
  @prop() kanji!: string
  @prop() readings!: string[]
  @prop() info!: string[]
  @prop() meanings!: string[]
}

export const DbCharacterModel = getModelForClass(DbCharacter, { schemaOptions: { collection: 'character' } })
