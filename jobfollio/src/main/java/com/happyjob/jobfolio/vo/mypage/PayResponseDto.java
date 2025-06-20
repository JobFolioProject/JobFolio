package com.happyjob.jobfolio.vo.mypage;

import com.happyjob.jobfolio.vo.pay.PayModel;

import java.util.List;

public class PayResponseDto {
    private List<PayHisDto> payModels;
    private int totalCount;

    public PayResponseDto() {
    }

    public PayResponseDto(List<PayHisDto> payModels, int totalCount) {
        this.payModels = payModels;
        this.totalCount = totalCount;
    }

    public List<PayHisDto> getPayModels() {
        return payModels;
    }

    public void setPayModels(List<PayHisDto> payModels) {
        this.payModels = payModels;
    }

    public int getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(int totalCount) {
        this.totalCount = totalCount;
    }
}
