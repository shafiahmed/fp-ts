import { ReaderTaskEither, readerTaskEither } from '../examples/ReaderTaskEither'
import { getApplicativeComposition } from '../src/Applicative'
import { liftA2 } from '../src/Apply'
import { array } from '../src/Array'
import { Const, const_ } from '../src/Const'
import { Either, either } from '../src/Either'
import { Functor2C, Functor3C, lift } from '../src/Functor'
import { getMonad as getIxIOMonad } from '../src/IxIO'
import { Option, option } from '../src/Option'
import * as optionT from '../src/OptionT'
import { Reader, reader } from '../src/Reader'
import { getArraySemigroup, semigroupString } from '../src/Semigroup'
import { task } from '../src/Task'
import { getMonad as getTheseMonad } from '../src/These'
import { sequence } from '../src/Traversable'
import { replicateA } from '../src/Unfoldable'
import { Validation, getApplicative, validation } from '../src/Validation'

const double = (n: number) => n * 2

//
// Functor
//

const liftedOption: (fa: Option<number>) => Option<number> = lift(option)(double)
const liftedEither: <L>(fa: Either<L, number>) => Either<L, number> = lift(either)(double)
const liftedReaderTaskEither: <U, L>(fa: ReaderTaskEither<U, L, number>) => ReaderTaskEither<U, L, number> = lift(
  readerTaskEither
)(double)
declare const EitherFunctor2C: Functor2C<'Either', string>
const liftedF: (fa: Either<string, number>) => Either<string, number> = lift(EitherFunctor2C)(double)
declare const ReaderTaskEitherFunctor3C: Functor3C<'ReaderTaskEither', string, boolean>
const liftedGD: (fa: ReaderTaskEither<string, boolean, number>) => ReaderTaskEither<string, boolean, number> = lift(
  ReaderTaskEitherFunctor3C
)(double)

//
// Traversable
//

const sequenceEitherArray: <L, A>(tfa: Either<L, A>[]) => Either<L, A[]> = sequence(either, array)
const sequenceTaskValidation = sequence(task, validation)
const sequenceEitherValidation = sequence(either, validation)
const sequenceValidationEither = sequence(getApplicative(semigroupString), either)

//
// Apply
//

const applicativeValidation = getApplicative(semigroupString)
const f1: <A, B, C>(
  f: (a: A) => (b: B) => C
) => (fa: Validation<string, A>) => (fb: Validation<string, B>) => Validation<string, C> = liftA2(applicativeValidation)

//
// Unfoldable
//

const replicateValidation: <A>(n: number, ma: Validation<string, A>) => Validation<string, Array<A>> = replicateA(
  applicativeValidation,
  array
)

//
// Applicative
//

const AC1 = getApplicativeComposition(reader, applicativeValidation)
const AC1map: <L, A, B>(fa: Reader<L, Validation<string, A>>, f: (a: A) => B) => Reader<L, Validation<string, B>> =
  AC1.map

//
// Contravariant
//

const const1: Const<boolean, string> = const_.contramap(new Const<boolean, number>(true), (s: string) => s.length)

//
// OptionT
//

// Monad2C

const these: optionT.OptionT2C<'These', string[]> = optionT.getOptionT(getTheseMonad(getArraySemigroup<string>()))

// Monad3C

const ixIO: optionT.OptionT3C<'IxIO', string, string> = optionT.getOptionT(getIxIOMonad<string>())
