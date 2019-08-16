options({
    resultStreamName: "user_A_total_balance_projection",
    $includeLinks: false,
    reorderEvents: false,
    processingLag: 0
})

fromStream('stopjeep_stream')
.when({
    $init:function(){
        return {
            balance: 0
        }
    },
    balanceUpdated: function(state, event){
        state.balance += event.amount;
    }
})
.outputState()