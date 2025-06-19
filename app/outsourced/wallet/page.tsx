"use client";

import React, { useEffect, useState } from "react";
import {
  useWalletBalance,
  useWalletTransactions,
  useFundWallet,
  useConfirmBankTransfer,
  useVerifyMpesaTransaction,
  handleApiError,
  useWallet,
  useCreateWallet,
  useApproveBankTransfer,
} from "@/lib/api-hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import {
  Wallet,
  Plus,
  CreditCard,
  Smartphone,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Copy,
  TrendingUp,
  TrendingDown,
  Calendar,
  FileCheck,
} from "lucide-react";
import type { OutsourcedWalletFundResponse } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";

// Fund Wallet Modal Component
const FundWalletModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"bank_transfer" | "mpesa">(
    "bank_transfer"
  );
  const [customerPhone, setCustomerPhone] = useState("");
  const [fundResponse, setFundResponse] =
    useState<OutsourcedWalletFundResponse | null>(null);

  const fundWallet = useFundWallet();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = {
        amount: parseInt(amount),
        payment_method: paymentMethod,
        ...(paymentMethod === "mpesa" && { customer_phone: customerPhone }),
      };

      const response = await fundWallet.mutateAsync(data);
      setFundResponse(response);

      toast({
        title: "Payment Instructions Generated",
        description: "Follow the instructions below to complete your payment.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: handleApiError(error),
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Copied to clipboard",
    });
  };

  const resetForm = () => {
    setAmount("");
    setCustomerPhone("");
    setFundResponse(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Fund Wallet</DialogTitle>
          <DialogDescription>
            Add funds to your outsourced payroll wallet
          </DialogDescription>
        </DialogHeader>

        {!fundResponse ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (KES)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="100000"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select
                value={paymentMethod}
                onValueChange={(value: "bank_transfer" | "mpesa") =>
                  setPaymentMethod(value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank_transfer">
                    <div className="flex items-center">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Bank Transfer
                    </div>
                  </SelectItem>
                  <SelectItem value="mpesa">
                    <div className="flex items-center">
                      <Smartphone className="h-4 w-4 mr-2" />
                      M-PESA
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {paymentMethod === "mpesa" && (
              <div className="space-y-2">
                <Label htmlFor="customerPhone">Phone Number</Label>
                <Input
                  id="customerPhone"
                  placeholder="254700123456"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  required
                />
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={fundWallet.isPending}>
                {fundWallet.isPending
                  ? "Generating..."
                  : "Generate Payment Instructions"}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="space-y-4">
            <Alert className="border-blue-200 bg-blue-50">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-3">
                  <h4 className="font-semibold">Payment Instructions</h4>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Reference:</span>
                      <div className="flex items-center gap-2">
                        <code className="bg-white px-2 py-1 rounded text-sm">
                          {fundResponse.reference}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            copyToClipboard(fundResponse.reference)
                          }
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-medium">Amount:</span>
                      <span>KES {fundResponse.amount.toLocaleString()}</span>
                    </div>
                  </div>

                  {fundResponse.payment_method === "bank_transfer" && (
                    <div className="bg-white p-3 rounded space-y-2">
                      <p>
                        <strong>Bank:</strong>{" "}
                        {fundResponse.payment_instructions.bank_name}
                      </p>
                      <div className="flex items-center justify-between">
                        <span>
                          <strong>Account:</strong>
                        </span>
                        <div className="flex items-center gap-2">
                          <code className="bg-gray-100 px-2 py-1 rounded">
                            {fundResponse.payment_instructions.account_number}
                          </code>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              copyToClipboard(
                                fundResponse.payment_instructions
                                  .account_number || ""
                              )
                            }
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p>
                        <strong>Name:</strong>{" "}
                        {fundResponse.payment_instructions.account_name}
                      </p>

                      <Alert className="border-red-200 bg-red-50 mt-3">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-sm">
                          <strong>IMPORTANT:</strong> Use reference{" "}
                          <code>{fundResponse.reference}</code> for easy
                          identification
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}

                  {fundResponse.payment_method === "mpesa" && (
                    <div className="bg-white p-3 rounded">
                      <p>Check your phone for the M-PESA payment prompt</p>

                      {/* Add the step-by-step instructions */}
                      {fundResponse.message && (
                        <div className="mt-3 border-t pt-3">
                          <h4 className="text-sm font-semibold mb-2">
                            Alternative Payment Method:
                          </h4>
                          <div className="bg-gray-50 p-3 rounded-md text-sm">
                            {fundResponse.message
                              .split(/\d+\./)
                              .filter(Boolean)
                              .map((step, index) => (
                                <div
                                  key={index}
                                  className="flex items-start mb-2 last:mb-0"
                                >
                                  <div className="bg-blue-100 text-blue-800 font-semibold rounded-full w-6 h-6 flex items-center justify-center mr-2 shrink-0">
                                    {index + 1}
                                  </div>
                                  <div className="mt-0.5">{step.trim()}</div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                      <p className="text-sm text-muted-foreground mt-1">
                        After completing payment, use the verification form to
                        credit your wallet
                      </p>
                    </div>
                  )}
                </div>
              </AlertDescription>
            </Alert>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
              {fundResponse.payment_method === "bank_transfer" && (
                <Button
                  onClick={() => {
                    handleClose();
                    // Could open confirm transfer modal here
                  }}
                >
                  I've Made the Transfer
                </Button>
              )}
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

// Confirm Bank Transfer Modal
const ConfirmTransferModal = ({
  isOpen,
  onClose,
  reference = "",
}: {
  isOpen: boolean;
  onClose: () => void;
  reference?: string;
}) => {
  const [formData, setFormData] = useState({
    reference: reference,
    bank_transaction_reference: "",
    amount: "",
    payment_date: "",
  });

  const confirmTransfer = useConfirmBankTransfer();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = {
        reference: formData.reference,
        bank_transaction_reference: formData.bank_transaction_reference,
        amount: parseInt(formData.amount),
        ...(formData.payment_date && { payment_date: formData.payment_date }),
      };

      await confirmTransfer.mutateAsync(data);

      toast({
        title: "Transfer Confirmed",
        description:
          "Your transfer is now pending approval from our admin team.",
      });

      onClose();
      setFormData({
        reference: "",
        bank_transaction_reference: "",
        amount: "",
        payment_date: "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: handleApiError(error),
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Bank Transfer</DialogTitle>
          <DialogDescription>
            Please enter the details of your bank transfer
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reference">Payment Reference</Label>
            <Input
              id="reference"
              value={formData.reference}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, reference: e.target.value }))
              }
              placeholder="Payment reference from fund request"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bankRef">Bank Transaction Reference</Label>
            <Input
              id="bankRef"
              value={formData.bank_transaction_reference}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  bank_transaction_reference: e.target.value,
                }))
              }
              placeholder="Bank transaction number/reference"
              required
            />
            <p className="text-xs text-muted-foreground">
              This is the reference number from your bank
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="transferAmount">Amount Transferred (KES)</Label>
            <Input
              id="transferAmount"
              type="number"
              value={formData.amount}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, amount: e.target.value }))
              }
              placeholder="100000"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentDate">Payment Date (Optional)</Label>
            <Input
              id="paymentDate"
              type="date"
              value={formData.payment_date}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  payment_date: e.target.value,
                }))
              }
              max={new Date().toISOString().split("T")[0]}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={confirmTransfer.isPending}>
              {confirmTransfer.isPending ? "Confirming..." : "Confirm Transfer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Approve Bank Transfer Modal
const ApproveBankTransferModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [formData, setFormData] = useState({
    reference: "",
    approved: false,
    notes: "",
  });

  const approveBankTransfer = useApproveBankTransfer();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = {
        reference: formData.reference,
        approved: true,
        ...(formData.notes && { amount: parseInt(formData.notes) }),
      };

      const response = await approveBankTransfer.mutateAsync(data);

      // Handle both direct object and AxiosResponse
      const respData =
        "data" in response && response.data ? response.data : response;

      if (respData.success) {
        toast({
          title: "Success!",
          description: `KES ${respData.amount?.toLocaleString()} has been credited to your wallet.`,
        });
        onClose();
        setFormData({ reference: "", approved: false, notes: "" });
      } else {
        toast({
          title: "Verification Failed",
          description: respData.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: handleApiError(error),
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Approve Bank Transfer</DialogTitle>
          <DialogDescription>
            Enter the Bank Transfer Reference code you received after making
            payment
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ref">Reference</Label>
            <Input
              id="ref"
              value={formData.reference}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  reference: e.target.value.toUpperCase(),
                }))
              }
              placeholder="OUT_FUND_AB48949_488"
              pattern="^OUT_FUND_.*$"
              title="Use the reference code provided by the system"
              className="font-mono"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Input
              id="notes"
              type="number"
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
              placeholder="Add notes or verification details"
            />
            <p className="text-xs text-muted-foreground">
              Optional: Add any notes or verification details
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={approveBankTransfer.isPending}>
              {approveBankTransfer.isPending
                ? "Approving..."
                : "Approve & Complete Wallet Transaction"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Verify M-PESA Transaction Modal
const VerifyMpesaModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [formData, setFormData] = useState({
    mpesa_transaction_code: "",
    amount: "",
  });

  const verifyTransaction = useVerifyMpesaTransaction();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = {
        mpesa_transaction_code: formData.mpesa_transaction_code,
        ...(formData.amount && { amount: parseInt(formData.amount) }),
      };

      const response = await verifyTransaction.mutateAsync(data);

      // Handle both direct object and AxiosResponse
      const respData =
        "data" in response && response.data ? response.data : response;

      if (respData.success) {
        toast({
          title: "Success!",
          description: `KES ${respData.amount?.toLocaleString()} has been credited to your wallet.`,
        });
        onClose();
        setFormData({ mpesa_transaction_code: "", amount: "" });
      } else {
        toast({
          title: "Verification Failed",
          description: respData.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: handleApiError(error),
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Verify M-PESA Transaction</DialogTitle>
          <DialogDescription>
            Enter the M-PESA transaction code you received after making payment
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mpesaCode">M-PESA Transaction Code</Label>
            <Input
              id="mpesaCode"
              value={formData.mpesa_transaction_code}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  mpesa_transaction_code: e.target.value.toUpperCase(),
                }))
              }
              placeholder="QGJ7XKHM6Y"
              pattern="[A-Z0-9]{10}"
              title="Transaction code should be 10 characters"
              className="font-mono"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="verifyAmount">Amount (Optional)</Label>
            <Input
              id="verifyAmount"
              type="number"
              value={formData.amount}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, amount: e.target.value }))
              }
              placeholder="100000"
            />
            <p className="text-xs text-muted-foreground">
              Optional: Verify the amount matches
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={verifyTransaction.isPending}>
              {verifyTransaction.isPending
                ? "Verifying..."
                : "Verify & Credit Wallet"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Main Wallet Page
export default function WalletPage() {
  const { user } = useAuth();
  const roles = user?.user?.roles;
  const [isFundModalOpen, setIsFundModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isCreatingWallet, setIsCreatingWallet] = useState(false);

  const {
    data: wallet,
    error: walletError,
    isLoading: walletLoading,
  } = useWallet();
  const createWallet = useCreateWallet();
  const { toast } = useToast();

  const {
    data: walletBalance,
    isLoading: balanceLoading,
    error: balanceError,
    refetch: refetchBalance,
  } = useWalletBalance();
  const {
    data: transactions,
    isLoading: transactionsLoading,
    refetch: refetchTransactions,
  } = useWalletTransactions(20, 0);

  // Handle automatic wallet creation if it doesn't exist
  useEffect(() => {
    const handleWalletCreation = async () => {
      // only proceed if wallet data has been fetched and no wallet exists
      if (!walletLoading && !wallet?.wallet) {
        try {
          setIsCreatingWallet(true);
          await createWallet.mutateAsync();
          toast({
            title: "Wallet Created",
            description:
              "Your outsourced payroll wallet has been created successfully.",
          });
          // Refetch data after wallet creation
          refetchBalance();
          refetchTransactions();
        } catch (error) {
          toast({
            title: "Wallet Creation Failed",
            description: handleApiError(error),
            variant: "destructive",
          });
        } finally {
          setIsCreatingWallet(false);
        }
      }
    };

    handleWalletCreation();
  }, [wallet, walletLoading, createWallet, toast, isCreatingWallet]);

  const formatCurrency = (amount: number) =>
    `KES ${amount.toLocaleString("en-KE", { minimumFractionDigits: 0 })}`;

  if (walletLoading || isCreatingWallet) {
    return (
      <div className="container mx-auto py-6 px-4 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Wallet Management
          </h1>
          <p className="text-muted-foreground">
            {isCreatingWallet
              ? "Creating your wallet..."
              : "Loading wallet information..."}
          </p>
        </div>
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Outsourced Payroll Wallet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Skeleton className="h-12 w-48" />
              <Skeleton className="h-4 w-32" />
              <div className="flex gap-4 mt-6">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (balanceError || walletError) {
    return (
      <div className="container mx-auto py-6 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load wallet information. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Wallet Management</h1>
        <p className="text-muted-foreground">
          Manage your outsourced payroll wallet balance and transactions
        </p>
      </div>

      {/* Wallet Balance Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Outsourced Payroll Wallet
          </CardTitle>
        </CardHeader>
        <CardContent>
          {balanceLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-48" />
              <Skeleton className="h-4 w-32" />
              <div className="flex gap-4 mt-6">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          ) : walletBalance ? (
            <div className="space-y-4">
              <div className="text-4xl font-bold text-blue-700">
                {formatCurrency(walletBalance.balance)}
              </div>
              <p className="text-sm text-muted-foreground">
                Last updated:{" "}
                {new Date(walletBalance.last_updated).toLocaleString()}
              </p>

              <div className="flex flex-wrap gap-4 mt-6">
                <Button
                  onClick={() => setIsFundModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Fund Wallet
                </Button>
                <Button
                  onClick={() => setIsConfirmModalOpen(true)}
                  variant="outline"
                  className="border-green-200 text-green-700 hover:bg-green-50"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Confirm Bank Transfer
                </Button>
                {roles?.includes("SUPER_ADMIN") &&
                  transactions?.transactions?.some(
                    (txn) => txn.paymentStatus === "PENDING"
                  ) && (
                    <Button
                      onClick={() => setIsApproveModalOpen(true)}
                      variant="outline"
                      className="border-yellow-200 text-yellow-700 hover:bg-yellow-50"
                    >
                      <FileCheck className="h-4 w-4 mr-2" />
                      Approve Bank Transfer
                    </Button>
                  )}
                <Button
                  onClick={() => setIsVerifyModalOpen(true)}
                  variant="outline"
                  className="border-orange-200 text-orange-700 hover:bg-orange-50"
                >
                  <Smartphone className="h-4 w-4 mr-2" />
                  Verify M-PESA
                </Button>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {transactionsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : transactions?.transactions.length === 0 ? (
            <div className="text-center py-8">
              <RefreshCw className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">No transactions yet</p>
              <p className="text-muted-foreground">
                Your wallet transactions will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions?.transactions.map((txn) => (
                    <TableRow key={txn.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {new Date(txn.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {txn.transactionType === "CREDIT" ? (
                            <TrendingUp className="h-4 w-4 text-green-500" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-500" />
                          )}
                          <span
                            className={`font-medium ${
                              txn.transactionType === "CREDIT"
                                ? "text-green-700"
                                : "text-red-700"
                            }`}
                          >
                            {txn.transactionType === "CREDIT"
                              ? "Credit"
                              : "Debit"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`font-bold ${
                            txn.transactionType === "CREDIT"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {txn.transactionType === "CREDIT" ? "+" : "-"}
                          {formatCurrency(txn.amount)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <code className="bg-muted px-2 py-1 rounded text-xs">
                          {txn.reference}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            txn.paymentStatus === "COMPLETED"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {txn.paymentStatus}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {transactions &&
                transactions.total_count > transactions.limit && (
                  <div className="text-center pt-4">
                    <Button variant="outline" size="sm">
                      Load More Transactions
                    </Button>
                  </div>
                )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Balance Alert */}
      {walletBalance && walletBalance.balance < 100000 && (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Your wallet balance is running low. Consider adding funds to ensure
            smooth payroll processing.
          </AlertDescription>
        </Alert>
      )}

      {/* Modals */}
      <FundWalletModal
        isOpen={isFundModalOpen}
        onClose={() => setIsFundModalOpen(false)}
      />

      <ConfirmTransferModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
      />

      <ApproveBankTransferModal
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
      />

      <VerifyMpesaModal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
      />
    </div>
  );
}
