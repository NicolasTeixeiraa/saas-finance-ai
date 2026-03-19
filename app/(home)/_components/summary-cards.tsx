import {
  PiggyBankIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  WalletIcon,
} from "lucide-react";
import SummaryCard from "./summary-card";

interface SummaryCards {
  month: string;
  balance: number;
  depositsTotal: number;
  investmentsTotal: number;
  expensesTotal: number;
  userCanAddTransaction?: boolean;
}

const SummaryCards = async ({
  balance,
  depositsTotal,
  investmentsTotal,
  expensesTotal,
  userCanAddTransaction,
}: SummaryCards) => {
  return (
    <div className="space-y-6">
      {/* Primeiro card */}
      <SummaryCard
        icon={<WalletIcon size={20} />}
        title="Saldo"
        amount={balance}
        size="large"
        userCanAddTransaction={userCanAddTransaction}
      />

      {/* Outros card */}
      <div className="grid grid-cols-3 gap-6">
        <SummaryCard
          icon={<PiggyBankIcon size={20} />}
          title="Investido"
          amount={investmentsTotal}
        />
        <SummaryCard
          icon={<TrendingUpIcon size={20} className="text-primary" />}
          title="Receita"
          amount={depositsTotal}
        />
        <SummaryCard
          icon={<TrendingDownIcon size={20} className="text-danger" />}
          title="Despesas"
          amount={expensesTotal}
        />
      </div>
    </div>
  );
};

export default SummaryCards;
