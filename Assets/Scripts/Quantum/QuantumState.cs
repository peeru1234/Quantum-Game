using UnityEngine;

namespace QBreak.Quantum
{
    public enum BasisType
    {
        Z,
        X
    }

    public enum StateType
    {
        Zero,  // |0>
        One,   // |1>
        Plus,  // |+>
        Minus  // |->
    }

    public static class QuantumMath
    {
        public static string GetStringRepresentation(StateType state)
        {
            switch (state)
            {
                case StateType.Zero: return "|0>";
                case StateType.One: return "|1>";
                case StateType.Plus: return "|+>";
                case StateType.Minus: return "|->";
                default: return "|0>";
            }
        }

        public static StateType QuantumFlip(StateType current)
        {
            switch (current)
            {
                case StateType.Zero: return StateType.One;
                case StateType.One: return StateType.Zero;
                case StateType.Plus: return StateType.Minus;
                case StateType.Minus: return StateType.Plus;
                default: return StateType.One;
            }
        }

        public static StateType MeasureZ(StateType current)
        {
            if (current == StateType.Zero) return StateType.Zero;
            if (current == StateType.One) return StateType.One;

            // Superposition state |+> or |-> collapses to |0> or |1> with 50/50 probability
            return Random.value < 0.5f ? StateType.Zero : StateType.One;
        }

        public static StateType MeasureX(StateType current)
        {
            if (current == StateType.Plus) return StateType.Plus;
            if (current == StateType.Minus) return StateType.Minus;

            // Computational state |0> or |1> collapses to |+> or |-> with 50/50 probability
            return Random.value < 0.5f ? StateType.Plus : StateType.Minus;
        }
    }
}
